# 扑克牌手数据库 - FastAPI 入口
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from .config import get_settings
from .database import init_db, get_engine, Base
from .auth.routes import router as auth_router
from .api.players import router as players_router
from .api.videos import router as videos_router
from .api.tournaments import router as tournaments_router
from .api.subscription import router as subscription_router
from .payment.stripe import router as stripe_router
from .payment.wechat import router as wechat_router


settings = get_settings()

# 频率限制器
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[settings.RATE_LIMIT_ANON],
    headers_enabled=True,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期：启动时初始化数据库"""
    # 创建所有表
    engine = get_engine()
    Base.metadata.create_all(bind=engine)
    # 初始化 SessionLocal
    init_db()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="全球扑克牌手数据库 API - Triton Poker DB",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应限制为前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 频率限制
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# 注册路由
app.include_router(auth_router, prefix=f"{settings.API_PREFIX}/auth", tags=["认证"])
app.include_router(players_router, prefix=f"{settings.API_PREFIX}/players", tags=["选手"])
app.include_router(videos_router, prefix=f"{settings.API_PREFIX}/videos", tags=["视频"])
app.include_router(tournaments_router, prefix=f"{settings.API_PREFIX}/tournaments", tags=["赛事"])
app.include_router(subscription_router, prefix=f"{settings.API_PREFIX}/subscription", tags=["订阅"])
app.include_router(stripe_router, prefix=f"{settings.API_PREFIX}/payment/stripe", tags=["Stripe 支付"])
app.include_router(wechat_router, prefix=f"{settings.API_PREFIX}/payment", tags=["微信/支付宝"])


@app.get(f"{settings.API_PREFIX}/health")
async def health_check():
    return {"status": "ok", "version": settings.APP_VERSION}


@app.get(f"{settings.API_PREFIX}/plans")
async def get_plans():
    """获取订阅计划列表"""
    return {
        "plans": [
            {
                "plan": "monthly",
                "name": "月度会员",
                "price_cny": 68,
                "price_usd": 9.99,
                "currency": "cny",
                "description": "按月订阅，随时取消",
            },
            {
                "plan": "yearly",
                "name": "年度会员",
                "price_cny": 688,
                "price_usd": 99,
                "currency": "cny",
                "description": "年付省 17%，最划算",
            },
            {
                "plan": "lifetime",
                "name": "终身会员",
                "price_cny": 3888,
                "price_usd": 499,
                "currency": "cny",
                "description": "一次购买，永久使用",
            },
        ]
    }
