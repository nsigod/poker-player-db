# 扑克牌手数据库 - Pydantic 请求/响应模型
from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


# ============ Auth ============

class RegisterRequest(BaseModel):
    email: str
    password: str = Field(min_length=6)
    name: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class UserInfo(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    tier: str
    is_premium: bool
    tier_expires_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ============ Player ============

class PlayerBasic(BaseModel):
    """免费用户可见的选手基础信息"""
    id: int
    slug: str
    name: str
    country: Optional[str] = None
    flag: Optional[str] = None
    titles: int = 0
    cashes: int = 0
    total_earnings: Optional[str] = None

    class Config:
        from_attributes = True


class PlayerResultItem(BaseModel):
    year: Optional[int] = None
    location: Optional[str] = None
    event_name: Optional[str] = None
    buy_in: Optional[str] = None
    prize: Optional[str] = None
    placing: Optional[str] = None
    players_count: Optional[int] = None

    class Config:
        from_attributes = True


class PlayerFull(BaseModel):
    """付费用户可见的完整选手信息"""
    id: int
    slug: str
    name: str
    country: Optional[str] = None
    flag: Optional[str] = None
    nickname: Optional[str] = None
    image: Optional[str] = None
    total_earnings: Optional[str] = None
    titles: int = 0
    cashes: int = 0
    best_cash: Optional[str] = None
    bio: Optional[str] = None
    tags: list = []
    other_series: list = []

    class Config:
        from_attributes = True


class PlayerListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    players: list[PlayerBasic]


class PlayerDetailResponse(BaseModel):
    player: PlayerFull
    results: list[PlayerResultItem] = []


# ============ Video ============

class VideoItemBasic(BaseModel):
    """免费用户可见的视频基础信息（无播放链接）"""
    id: int
    title: str
    thumbnail: Optional[str] = None
    platform: Optional[str] = None
    duration: Optional[str] = None
    published_at: Optional[date] = None
    event: Optional[str] = None
    tags: list = []
    views: Optional[str] = None
    save_count: int = 0

    class Config:
        from_attributes = True


class VideoItemFull(VideoItemBasic):
    """付费用户可见的完整视频信息（含播放链接）"""
    url: Optional[str] = None
    players: list = []
    player_ids: list = []
    subtitles: Optional[str] = None
    description: Optional[str] = None
    source_type: str = "embed"
    is_saved: bool = False      # 当前用户是否已收藏
    saved_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class VideoListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    videos: list[VideoItemFull]


class VideoAddRequest(BaseModel):
    """手动添加视频"""
    title: str
    url: str
    platform: Optional[str] = None
    event: Optional[str] = None
    players: Optional[list[str]] = []
    tags: Optional[list[str]] = []
    subtitles: Optional[str] = None
    description: Optional[str] = None


class VideoBatchImportRequest(BaseModel):
    """批量导入视频"""
    videos: list[VideoAddRequest]


class VideoStatsResponse(BaseModel):
    """视频库统计"""
    total_videos: int
    by_platform: dict[str, int] = {}
    by_event: dict[str, int] = {}
    recent_count: int = 0          # 近 7 天新增
    total_views: str = "0"


class UserSavedVideoItem(BaseModel):
    """用户收藏的视频"""
    id: int
    video_id: int
    title: str
    thumbnail: Optional[str] = None
    platform: Optional[str] = None
    duration: Optional[str] = None
    event: Optional[str] = None
    players: list = []
    tags: list = []
    url: Optional[str] = None
    saved_at: datetime

    class Config:
        from_attributes = True


class SavedVideoListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    saved_videos: list[UserSavedVideoItem]


# ============ Tournament ============

class TournamentBasic(BaseModel):
    """免费用户可见的赛事基础信息"""
    id: int
    name: Optional[str] = None
    year: Optional[int] = None
    location: Optional[str] = None
    events_count: Optional[int] = None
    total_prize_pool: Optional[str] = None
    winner: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


class TournamentEventItem(BaseModel):
    id: int
    name: Optional[str] = None
    game_type: Optional[str] = None
    buy_in: Optional[str] = None
    entries: Optional[int] = None
    prize_pool: Optional[str] = None
    date: Optional[date] = None
    status: Optional[str] = None

    class Config:
        from_attributes = True


class TournamentEventResultItem(BaseModel):
    placing: Optional[str] = None
    player_name: Optional[str] = None
    prize: Optional[str] = None
    country: Optional[str] = None
    flag: Optional[str] = None

    class Config:
        from_attributes = True


class TournamentFull(BaseModel):
    """付费用户可见的完整赛事信息"""
    id: int
    name: Optional[str] = None
    year: Optional[int] = None
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    events_count: Optional[int] = None
    total_prize_pool: Optional[str] = None
    winner: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    event_list: list[TournamentEventItem] = []

    class Config:
        from_attributes = True


class TournamentListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    tournaments: list[TournamentBasic]


# ============ Subscription ============

class SubscriptionPlan(BaseModel):
    plan: str
    name: str
    price_cny: float
    price_usd: float
    description: str


class CheckoutRequest(BaseModel):
    plan: str  # "monthly" | "yearly" | "lifetime"
    provider: str  # "stripe" | "wechat" | "alipay"
    currency: str = "cny"  # "cny" | "usd"


class CheckoutResponse(BaseModel):
    checkout_url: Optional[str] = None
    qr_code_url: Optional[str] = None
    order_id: Optional[str] = None


class SubscriptionInfo(BaseModel):
    id: int
    plan: str
    status: str
    payment_provider: str
    started_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    is_active: bool

    class Config:
        from_attributes = True


# ============ Common ============

class MessageResponse(BaseModel):
    message: str
    success: bool = True


class PaginatedParams(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
