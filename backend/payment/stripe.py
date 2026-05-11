# Stripe 支付集成
import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..config import get_settings
from ..database import get_db
from ..models import User
from ..schemas import CheckoutResponse, MessageResponse
from ..auth.deps import get_current_user
from ..api.subscription import activate_subscription

router = APIRouter()

# Stripe 价格 ID 映射
PLAN_PRICES = {
    "monthly_cny": ("price_monthly_cny", 68.0, "cny"),
    "monthly_usd": ("price_monthly_usd", 9.99, "usd"),
    "yearly_cny": ("price_yearly_cny", 688.0, "cny"),
    "yearly_usd": ("price_yearly_usd", 99.0, "usd"),
    "lifetime_cny": ("price_lifetime_cny", 3888.0, "cny"),
    "lifetime_usd": ("price_lifetime_usd", 499.0, "usd"),
}


def get_stripe_client():
    settings = get_settings()
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe 未配置")
    return stripe


@router.post("/checkout")
def create_checkout_session(
    plan: str,        # "monthly" | "yearly" | "lifetime"
    currency: str = "usd",  # "cny" | "usd"
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """创建 Stripe Checkout Session"""
    settings = get_settings()
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe 支付暂未开放")

    stripe.api_key = settings.STRIPE_SECRET_KEY

    price_key = f"{plan}_{currency}"
    if price_key not in PLAN_PRICES:
        raise HTTPException(status_code=400, detail="无效的订阅计划")

    # 对于一次性付款（lifetime）用 payment 模式，订阅用 subscription 模式
    if plan == "lifetime":
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": currency,
                    "product_data": {
                        "name": f"Triton Poker DB - 终身会员",
                        "description": "全球扑克牌手数据库终身会员",
                    },
                    "unit_amount": int(PLAN_PRICES[price_key][1] * 100),
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url=f"{settings.FRONTEND_URL}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.FRONTEND_URL}/pricing",
            client_reference_id=str(user.id),
            metadata={
                "user_id": str(user.id),
                "plan": plan,
                "currency": currency,
            },
        )
    else:
        # 获取 Stripe 中已创建的 Price ID
        price_id_attr = f"STRIPE_{{'MONTHLY':'monthly','YEARLY':'yearly'}}.upper()_PRICE_ID".format()
        price_id = getattr(settings, f"STRIPE_{plan.upper()}_PRICE_ID", None)

        if price_id:
            # 使用已配置的 Stripe Price
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[{"price": price_id, "quantity": 1}],
                mode="subscription",
                success_url=f"{settings.FRONTEND_URL}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{settings.FRONTEND_URL}/pricing",
                client_reference_id=str(user.id),
                metadata={
                    "user_id": str(user.id),
                    "plan": plan,
                    "currency": currency,
                },
            )
        else:
            # 自动创建（开发测试用）
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[{
                    "price_data": {
                        "currency": currency,
                        "recurring": {
                            "interval": "month" if plan == "monthly" else "year",
                        },
                        "product_data": {
                            "name": f"Triton Poker DB - {'月度' if plan == 'monthly' else '年度'}会员",
                            "description": "全球扑克牌手数据库付费会员",
                        },
                        "unit_amount": int(PLAN_PRICES[price_key][1] * 100),
                    },
                    "quantity": 1,
                }],
                mode="subscription",
                success_url=f"{settings.FRONTEND_URL}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{settings.FRONTEND_URL}/pricing",
                client_reference_id=str(user.id),
                metadata={
                    "user_id": str(user.id),
                    "plan": plan,
                    "currency": currency,
                },
            )

    return CheckoutResponse(
        checkout_url=session.url,
        order_id=session.id,
    )


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Stripe Webhook 回调"""
    settings = get_settings()
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe 未配置")

    stripe.api_key = settings.STRIPE_SECRET_KEY

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="签名验证失败")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        _handle_checkout_complete(session, db)

    elif event["type"] == "invoice.payment_succeeded":
        invoice = event["data"]["object"]
        _handle_subscription_renewal(invoice, db)

    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        _handle_subscription_cancelled(subscription, db)

    return {"success": True}


@router.get("/verify/{session_id}")
def verify_payment(
    session_id: str,
    user: User = Depends(get_current_user),
):
    """验证支付状态"""
    settings = get_settings()
    stripe.api_key = settings.STRIPE_SECRET_KEY

    session = stripe.checkout.Session.retrieve(session_id)

    if session.payment_status == "paid":
        return {"status": "paid", "plan": session.metadata.get("plan")}
    elif session.status == "complete":
        return {"status": "paid", "plan": session.metadata.get("plan")}
    else:
        return {"status": "pending"}


def _handle_checkout_complete(session, db: Session):
    """处理支付成功回调"""
    metadata = session.get("metadata", {})
    user_id = metadata.get("user_id")
    plan = metadata.get("plan")
    currency = metadata.get("currency", "usd")

    if not user_id or not plan:
        return

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        return

    # 检查是否已激活（幂等）
    if user.tier == plan and user.is_premium:
        return

    price_key = f"{plan}_{currency}"
    amount = PLAN_PRICES.get(price_key, (None, 0, currency))[1]

    activate_subscription(
        db=db,
        user=user,
        plan=plan,
        provider="stripe",
        payment_id=session.get("id") or session.get("subscription"),
        amount=amount,
        currency=currency,
    )


def _handle_subscription_renewal(invoice, db: Session):
    """处理订阅续费"""
    # 由 Stripe 自动处理，这里记录日志
    pass


def _handle_subscription_cancelled(subscription, db: Session):
    """处理订阅取消"""
    sub = db.query(Subscription).filter(
        Subscription.payment_id == subscription.id,
        Subscription.status == "active",
    ).first()
    if sub:
        sub.status = "cancelled"
        db.commit()
