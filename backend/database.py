# 扑克牌手数据库 - 数据库连接
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from .config import get_settings
import os


def _get_database_url() -> str:
    """优先使用 .env 配置，否则使用 SQLite 本地文件"""
    settings = get_settings()
    url = settings.database_url
    # 如果是默认 MySQL 配置且未设 DATABASE_URL，降级为 SQLite
    if not settings.DATABASE_URL and settings.DB_HOST == "localhost" and settings.DB_USER == "root":
        db_path = os.path.join(os.path.dirname(__file__), "..", "poker_data.db")
        db_path = os.path.abspath(db_path)
        return f"sqlite:///{db_path}"
    return url


class Base(DeclarativeBase):
    pass


def get_engine():
    url = _get_database_url()
    kwargs = dict(pool_pre_ping=True, pool_recycle=3600, echo=get_settings().DEBUG)
    if url.startswith("sqlite"):
        kwargs.pop("pool_pre_ping")
        kwargs.pop("pool_recycle")
    return create_engine(url, **kwargs)


def get_session_local():
    engine = get_engine()
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)


SessionLocal = None


def init_db():
    """初始化数据库连接（应用启动时调用）"""
    global SessionLocal
    SessionLocal = get_session_local()


def get_db():
    """FastAPI 依赖注入：获取数据库会话"""
    if SessionLocal is None:
        init_db()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
