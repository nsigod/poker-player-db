# 扑克牌手数据库 - SQLAlchemy 数据模型
import json
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Enum,
    ForeignKey, Date, JSON, Index, Numeric
)
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(50))
    password_hash = Column(String(255))
    wechat_openid = Column(String(128), unique=True, index=True)
    name = Column(String(100))
    tier = Column(Enum("free", "monthly", "yearly", "lifetime"), default="free")
    tier_expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    subscriptions = relationship("Subscription", back_populates="user", lazy="dynamic")

    @property
    def is_premium(self) -> bool:
        if self.tier == "lifetime":
            return True
        if self.tier in ("monthly", "yearly") and self.tier_expires_at:
            return self.tier_expires_at > datetime.utcnow()
        return False

    @property
    def active_subscription(self) -> "Subscription | None":
        if not self.subscriptions:
            return None
        return (
            self.subscriptions
            .filter_by(status="active")
            .order_by(Subscription.created_at.desc())
            .first()
        )


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    plan = Column(Enum("monthly", "yearly", "lifetime"), nullable=False)
    status = Column(Enum("active", "expired", "cancelled"), default="active")
    payment_provider = Column(Enum("stripe", "wechat", "alipay"), nullable=False)
    payment_id = Column(String(255))          # Stripe subscription_id / 微信订单号
    amount = Column(Numeric(10, 2))
    currency = Column(String(10))
    started_at = Column(DateTime)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="subscriptions")

    @property
    def is_active(self) -> bool:
        if self.status != "active":
            return False
        if self.expires_at and self.expires_at < datetime.utcnow():
            return False
        return True


class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    country = Column(String(100))
    flag = Column(String(20))
    nickname = Column(String(255))
    image = Column(String(500))              # COS 存储路径
    total_earnings = Column(String(50))
    titles = Column(Integer, default=0)
    cashes = Column(Integer, default=0)
    best_cash = Column(String(50))
    bio = Column(Text)
    tags = Column(JSON, default=list)
    other_series = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    results = relationship("PlayerResult", back_populates="player", lazy="dynamic")

    Index("ix_players_country", "country")
    Index("ix_players_titles", "titles")
    Index("ix_players_total_earnings", "total_earnings")


class PlayerResult(Base):
    __tablename__ = "player_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    player_id = Column(Integer, ForeignKey("players.id"), nullable=False, index=True)
    year = Column(Integer)
    location = Column(String(255))
    event_name = Column(String(500))
    buy_in = Column(String(50))
    prize = Column(String(50))
    placing = Column(String(50))
    players_count = Column(Integer)

    player = relationship("Player", back_populates="results")


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(String(255), unique=True, index=True)        # URL 友好标识
    title = Column(String(500), nullable=False, index=True)
    url = Column(String(1000), nullable=False)
    thumbnail = Column(String(1000))
    platform = Column(String(50), index=True)                  # youtube, twitch, pokertube, cos(自有)
    duration = Column(String(50))                              # HH:MM:SS
    duration_seconds = Column(Integer)                         # 秒数，方便排序
    views = Column(String(50))                                 # 播放量字符串
    views_num = Column(Integer, default=0)                     # 播放量数字，方便排序
    published_at = Column(Date, index=True)
    event = Column(String(255), index=True)                    # 赛事名称
    event_id = Column(Integer, ForeignKey("tournaments.id"), nullable=True)  # 关联赛事
    players = Column(JSON, default=list)                       # 关联选手名列表
    player_ids = Column(JSON, default=list)                    # 关联 Player.id 列表
    subtitles = Column(String(500))                            # 字幕文件 COS 路径
    tags = Column(JSON, default=list)                          # 标签列表
    description = Column(Text)                                 # 视频描述/摘要
    source_type = Column(String(20), default="embed")          # embed(外链) / upload(自有上传)
    cos_key = Column(String(500))                              # COS 对象键（自有视频）
    cos_thumbnail_key = Column(String(500))                    # COS 缩略图键
    is_active = Column(Integer, default=1, index=True)         # 0=下架 1=上架
    save_count = Column(Integer, default=0)                    # 被收藏次数
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    event_rel = relationship("Tournament", foreign_keys=[event_id])

    Index("ix_videos_platform_published", "platform", "published_at")
    Index("ix_videos_event_published", "event", "published_at")
    Index("ix_videos_title", "title")


class UserVideoSave(Base):
    __tablename__ = "user_video_saves"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
    video = relationship("Video")

    __table_args__ = (
        Index("ix_user_video_unique", "user_id", "video_id", unique=True),
    )


class Tournament(Base):
    __tablename__ = "tournaments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(500))
    year = Column(Integer, index=True)
    location = Column(String(255))
    start_date = Column(Date)
    end_date = Column(Date)
    events_count = Column(Integer)
    total_prize_pool = Column(String(100))
    winner = Column(String(255))
    image_url = Column(String(500))
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    event_list = relationship("TournamentEvent", back_populates="tournament", lazy="dynamic")


class TournamentEvent(Base):
    __tablename__ = "tournament_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tournament_id = Column(Integer, ForeignKey("tournaments.id"), nullable=False, index=True)
    name = Column(String(500))
    game_type = Column(String(100))
    buy_in = Column(String(50))
    entries = Column(Integer)
    prize_pool = Column(String(100))
    date = Column(Date)
    status = Column(String(20))

    tournament = relationship("Tournament", back_populates="event_list")

    results = relationship("TournamentEventResult", back_populates="event", lazy="dynamic")


class TournamentEventResult(Base):
    __tablename__ = "tournament_event_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    event_id = Column(Integer, ForeignKey("tournament_events.id"), nullable=False, index=True)
    placing = Column(String(50))
    player_name = Column(String(255))
    player_id = Column(Integer)            # link to Player.id
    prize = Column(String(50))
    country = Column(String(100))
    flag = Column(String(20))
    gpi_ranking = Column(Integer)

    event = relationship("TournamentEvent", back_populates="results")


class RateLimit(Base):
    __tablename__ = "rate_limits"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ip_address = Column(String(50), index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    endpoint = Column(String(255))
    request_count = Column(Integer, default=0)
    window_start = Column(DateTime, default=datetime.utcnow)

    Index("ix_rate_limits_ip_endpoint", "ip_address", "endpoint")
    Index("ix_rate_limits_user_endpoint", "user_id", "endpoint")
