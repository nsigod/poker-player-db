# 订阅管理 API
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Subscription
from ..schemas import MessageResponse, SubscriptionInfo
from ..auth.deps import get_current_user

router = APIRouter()


@router.get("/info")
def get_my_subscription(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """获取我的订阅信息"""
    sub = user.active_subscription
    return {
        "tier": user.tier,
        "is_premium": user.is_premium,
        "tier_expires_at": str(user.tier_expires_at) if user.tier_expires_at else None,
        "subscription": SubscriptionInfo.model_validate(sub) if sub else None,
    }


@router.post("/cancel")
def cancel_subscription(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """取消订阅（到期后不再续费，当前周期仍有效）"""
    sub = user.active_subscription
    if not sub:
        raise HTTPException(status_code=400, detail="没有活跃订阅")

    sub.status = "cancelled"
    db.commit()

    return MessageResponse(message="订阅已取消，当前周期内仍可使用", success=True)


@router.get("/history")
def get_subscription_history(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """获取订阅历史"""
    subs = (
        db.query(Subscription)
        .filter(Subscription.user_id == user.id)
        .order_by(Subscription.created_at.desc())
        .all()
    )
    return [
        SubscriptionInfo.model_validate(s)
        for s in subs
    ]


def activate_subscription(
    db: Session,
    user: User,
    plan: str,
    provider: str,
    payment_id: str,
    amount: float | None = None,
    currency: str = "cny",
) -> Subscription:
    """激活用户订阅（支付成功后调用）"""
    # 计算到期时间
    if plan == "lifetime":
        tier_expires = None
    elif plan == "monthly":
        tier_expires = datetime.utcnow() + timedelta(days=30)
    elif plan == "yearly":
        tier_expires = datetime.utcnow() + timedelta(days=365)
    else:
        raise ValueError(f"Unknown plan: {plan}")

    # 标记旧订阅为过期
    old_subs = (
        db.query(Subscription)
        .filter(Subscription.user_id == user.id, Subscription.status == "active")
        .all()
    )
    for s in old_subs:
        s.status = "expired"

    # 创建新订阅
    subscription = Subscription(
        user_id=user.id,
        plan=plan,
        status="active",
        payment_provider=provider,
        payment_id=payment_id,
        amount=amount,
        currency=currency,
        started_at=datetime.utcnow(),
        expires_at=tier_expires,
    )
    db.add(subscription)

    # 更新用户等级
    user.tier = plan
    user.tier_expires_at = tier_expires
    user.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(subscription)
    return subscription
