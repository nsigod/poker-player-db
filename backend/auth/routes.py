# 认证路由 - 注册/登录/刷新Token
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Subscription
from ..schemas import (
    RegisterRequest, LoginRequest, RefreshTokenRequest,
    TokenResponse, UserInfo, MessageResponse,
)
from .jwt import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token,
)
from .deps import get_current_user

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """邮箱注册"""
    # 检查邮箱是否已存在
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="该邮箱已注册",
        )

    # 创建用户
    user = User(
        email=req.email,
        name=req.name,
        password_hash=hash_password(req.password),
        tier="free",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 生成 Token
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=900,  # 15 分钟
    )


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """邮箱密码登录"""
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="邮箱或密码错误",
        )

    if not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="邮箱或密码错误",
        )

    # 更新到期状态
    _check_tier_expiry(user, db)

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=900,
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(req: RefreshTokenRequest, db: Session = Depends(get_db)):
    """刷新 Access Token"""
    payload = decode_token(req.refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的 Refresh Token",
        )

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户不存在",
        )

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=900,
    )


@router.get("/me", response_model=UserInfo)
def get_me(user: User = Depends(get_current_user)):
    """获取当前用户信息"""
    return UserInfo(
        id=user.id,
        email=user.email,
        name=user.name,
        tier=user.tier,
        is_premium=user.is_premium,
        tier_expires_at=user.tier_expires_at,
        created_at=user.created_at,
    )


@router.get("/subscription", response_model=dict)
def get_subscription_info(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """获取当前用户订阅详情"""
    _check_tier_expiry(user, db)
    sub = user.active_subscription
    return {
        "tier": user.tier,
        "is_premium": user.is_premium,
        "tier_expires_at": user.tier_expires_at,
        "subscription": {
            "id": sub.id,
            "plan": sub.plan,
            "status": sub.status,
            "payment_provider": sub.payment_provider,
            "started_at": str(sub.started_at) if sub.started_at else None,
            "expires_at": str(sub.expires_at) if sub.expires_at else None,
        } if sub else None,
    }


def _check_tier_expiry(user: User, db: Session):
    """检查用户等级是否过期，自动降级"""
    if user.tier == "lifetime":
        return
    if user.tier in ("monthly", "yearly") and user.tier_expires_at:
        if user.tier_expires_at.replace(tzinfo=None) < __import__("datetime").datetime.utcnow():
            user.tier = "free"
            user.tier_expires_at = None
            # 标记订阅为过期
            active_sub = user.active_subscription
            if active_sub:
                active_sub.status = "expired"
            db.commit()
