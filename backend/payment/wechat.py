# 微信支付 + 支付宝集成
import time
import hashlib
import uuid
import xml.etree.ElementTree as ET
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..config import get_settings
from ..database import get_db
from ..models import User
from ..schemas import CheckoutResponse, MessageResponse
from ..auth.deps import get_current_user
from ..api.subscription import activate_subscription

router = APIRouter()

# 价格映射
PRICES = {
    ("monthly", "cny"): 6880,   # 68.00 元 → 分
    ("yearly", "cny"): 68800,   # 688.00 元 → 分
    ("lifetime", "cny"): 388800, # 3888.00 元 → 分
}


@router.post("/wechat/checkout")
def wechat_checkout(
    plan: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """创建微信支付订单"""
    settings = get_settings()
    if not settings.WECHAT_APP_ID:
        raise HTTPException(status_code=500, detail="微信支付暂未开放")

    price_key = (plan, "cny")
    total_fee = PRICES.get(price_key)
    if not total_fee:
        raise HTTPException(status_code=400, detail="无效的订阅计划")

    order_id = f"POKER_{uuid.uuid4().hex[:16].upper()}"
    notify_url = settings.WECHAT_NOTIFY_URL

    # 构建微信支付请求参数
    params = {
        "appid": settings.WECHAT_APP_ID,
        "mch_id": settings.WECHAT_MCH_ID,
        "nonce_str": uuid.uuid4().hex,
        "body": f"Triton Poker DB - {plan}会员",
        "out_trade_no": order_id,
        "total_fee": str(total_fee),
        "spbill_create_ip": "127.0.0.1",
        "notify_url": notify_url,
        "trade_type": "NATIVE",  # 扫码支付
        "product_id": order_id,
    }

    # 签名
    params["sign"] = _wechat_sign(params, settings.WECHAT_MCH_KEY)

    # 调用统一下单 API
    xml_data = _dict_to_xml(params)
    # TODO: 实际调用 https://api.mch.weixin.qq.com/pay/unifiedorder
    # 目前返回模拟数据
    return CheckoutResponse(
        qr_code_url=f"weixin://wxpay/bizpayurl?pr={order_id}",
        order_id=order_id,
    )


@router.post("/wechat/notify")
async def wechat_notify(request: Request, db: Session = Depends(get_db)):
    """微信支付回调"""
    body = await request.body()
    data = _xml_to_dict(body)

    settings = get_settings()
    sign = data.pop("sign", "")
    calculated_sign = _wechat_sign(data, settings.WECHAT_MCH_KEY)

    if sign != calculated_sign:
        return "<xml><return_code><![CDATA[FAIL]]></return_code></xml>"

    if data.get("result_code") == "SUCCESS":
        order_id = data.get("out_trade_no", "")
        _process_order_success(order_id, "wechat", db)

    return "<xml><return_code><![CDATA[SUCCESS]]></return_code></xml>"


@router.post("/alipay/checkout")
def alipay_checkout(
    plan: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """创建支付宝订单"""
    settings = get_settings()
    if not settings.ALIPAY_APP_ID:
        raise HTTPException(status_code=500, detail="支付宝支付暂未开放")

    price_key = (plan, "cny")
    total_fee = PRICES.get(price_key)
    if not total_fee:
        raise HTTPException(status_code=400, detail="无效的订阅计划")

    order_id = f"POKER_{uuid.uuid4().hex[:16].upper()}"
    amount = total_fee / 100  # 转为元

    # 构建支付宝请求参数
    # TODO: 使用 python-alipay-sdk 或手动签名
    # 目前返回模拟数据
    return CheckoutResponse(
        checkout_url=f"https://openapi.alipay.com/gateway.do?orderId={order_id}",
        order_id=order_id,
    )


@router.post("/alipay/notify")
async def alipay_notify(request: Request, db: Session = Depends(get_db)):
    """支付宝回调"""
    form_data = await request.form()
    order_id = form_data.get("out_trade_no", "")

    settings = get_settings()
    # TODO: 验证支付宝签名

    if form_data.get("trade_status") == "TRADE_SUCCESS":
        _process_order_success(order_id, "alipay", db)

    return {"success": True}


@router.get("/verify/{order_id}")
def verify_order(
    order_id: str,
    user: User = Depends(get_current_user),
):
    """查询订单状态"""
    # TODO: 查询微信/支付宝订单状态
    return {"status": "pending", "order_id": order_id}


def _process_order_success(order_id: str, provider: str, db: Session):
    """处理支付成功（微信/支付宝通用）"""
    from ..models import Subscription

    # 从 order_id 解析 plan（需要存储订单信息，这里简化处理）
    sub = (
        db.query(Subscription)
        .filter(Subscription.payment_id == order_id, Subscription.status == "active")
        .first()
    )
    if sub:
        return  # 已处理过

    # TODO: 实际项目中应该有 orders 表记录订单信息
    # 这里简化为直接激活
    pass


def _wechat_sign(params: dict, api_key: str) -> str:
    """微信支付签名"""
    sorted_params = sorted(params.items())
    string_a = "&".join(f"{k}={v}" for k, v in sorted_params if v)
    string_sign_temp = f"{string_a}&key={api_key}"
    return hashlib.md5(string_sign_temp.encode()).hexdigest().upper()


def _dict_to_xml(data: dict) -> str:
    """字典转 XML"""
    xml = ["<xml>"]
    for k, v in data.items():
        xml.append(f"<{k}><![CDATA[{v}]]></{k}>")
    xml.append("</xml>")
    return "".join(xml)


def _xml_to_dict(xml_str: bytes) -> dict:
    """XML 转字典"""
    root = ET.fromstring(xml_str)
    return {child.tag: child.text for child in root}
