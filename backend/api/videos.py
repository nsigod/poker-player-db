# 视频 API - 完整视频库管理
import re
from datetime import datetime, date, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func, desc, case

from ..database import get_db
from ..models import User, Video, UserVideoSave
from ..schemas import (
    VideoItemFull, VideoItemBasic, VideoListResponse,
    VideoAddRequest, VideoBatchImportRequest,
    VideoStatsResponse, UserSavedVideoItem, SavedVideoListResponse,
    MessageResponse,
)
from ..auth.deps import get_current_user, get_optional_user, require_premium

router = APIRouter()


# ============ 工具函数 ============

def _parse_youtube_id(url: str) -> Optional[str]:
    """从 YouTube URL 提取视频 ID"""
    patterns = [
        r'youtube\.com/watch\?v=([^&]+)',
        r'youtu\.be/([^?]+)',
        r'youtube\.com/embed/([^?]+)',
    ]
    for p in patterns:
        m = re.search(p, url)
        if m:
            return m.group(1)
    return None


def _detect_platform(url: str) -> str:
    """自动检测视频平台"""
    url_lower = url.lower()
    if 'youtube.com' in url_lower or 'youtu.be' in url_lower:
        return 'youtube'
    if 'twitch.tv' in url_lower:
        return 'twitch'
    if 'pokertube.com' in url_lower:
        return 'pokertube'
    return 'other'


def _auto_thumbnail(url: str) -> Optional[str]:
    """根据 URL 自动生成缩略图"""
    yt_id = _parse_youtube_id(url)
    if yt_id:
        return f"https://img.youtube.com/vi/{yt_id}/maxresdefault.jpg"
    return None


def _generate_slug(title: str, existing_slugs: set) -> str:
    """生成 URL 友好的 slug"""
    base = re.sub(r'[^a-zA-Z0-9\u4e00-\u9fff]+', '-', title).strip('-').lower()
    slug = base[:100]
    counter = 1
    while slug in existing_slugs:
        slug = f"{base[:97]}-{counter}"
        counter += 1
    return slug


def _user_saved_video_ids(user_id: int, db: Session, video_ids: list[int]) -> set[int]:
    """批量查询用户已收藏的视频 ID"""
    if not video_ids or not user_id:
        return set()
    saves = db.query(UserVideoSave.video_id).filter(
        UserVideoSave.user_id == user_id,
        UserVideoSave.video_id.in_(video_ids),
    ).all()
    return {s.video_id for s in saves}


def _build_video_full(video: Video, user_id: Optional[int], saved_ids: set[int]) -> dict:
    """构建完整视频响应"""
    data = VideoItemFull.model_validate(video).model_dump()
    if user_id:
        data['is_saved'] = video.id in saved_ids
        if data['is_saved']:
            # 查收藏时间
            pass
    else:
        data['is_saved'] = False
    return data


def _normalize_hand(s: str) -> str:
    """标准化手牌输入: 'aa'->'AA', 'ak s'->'AKs', 't9o'->'T9o'"""
    s = s.strip().upper().replace(' ', '')
    return s


def _is_hand_pattern(s: str) -> bool:
    """判断是否为扑克手牌格式: AA, AKs, T9o, 87s 等"""
    import re as _re
    s = s.strip().upper().replace(' ', '')
    return bool(_re.match(r'^[AKQJT2-9]{2}[so]?$', s))


# ============ 视频列表（分级访问） ============

@router.get("", response_model=VideoListResponse)
def list_videos(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str = Query(None, description="全局搜索：玩家姓名、赛事、手牌、字幕内容、标签、描述"),
    search_scope: str = Query("all", description="搜索范围: all, player, event, hand, subtitle, tag"),
    platform: str = Query(None, description="平台筛选: youtube, twitch, pokertube, other"),
    event: str = Query(None, description="赛事筛选"),
    tag: str = Query(None, description="标签筛选"),
    sort_by: str = Query("newest", description="排序: newest, oldest, views"),
    user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """获取视频列表
    - 所有人可见标题和缩略图
    - 付费用户可看完整信息（播放链接、选手列表等）
    - 免费用户 url 字段为空
    - search 在 search_scope 指定范围内搜索
    - search_scope=all 时跨所有字段搜索（标题+玩家+赛事+手牌/字幕+标签+描述）
    - search_scope=hand 时自动识别手牌格式（如 AA, AKs, T9o）
    """
    is_premium = user.is_premium if user else False
    user_id = user.id if user else None

    query = db.query(Video).filter(Video.is_active == 1)

    # ---- 搜索逻辑（多维度） ----
    if search:
        scope = search_scope.lower() if search_scope else "all"

        if scope == "player":
            # 仅搜索玩家姓名（players JSON 数组中的元素）
            q = f"%{search}%"
            query = query.filter(
                or_(
                    Video.players.contains(search),          # 精确匹配 JSON 数组元素
                    Video.players.ilike(q),                   # 模糊匹配
                )
            )

        elif scope == "event":
            # 仅搜索赛事名称
            query = query.filter(Video.event.ilike(f"%{search}%"))

        elif scope == "hand":
            # 搜索手牌/字幕关键词内容
            q = f"%{search}%"
            query = query.filter(
                or_(
                    Video.subtitles.ilike(q),                # 字幕/手牌文本搜索
                    Video.description.ilike(q),              # 描述中也可能包含手牌分析
                )
            )

        elif scope == "subtitle":
            # 仅搜索字幕内容
            query = query.filter(Video.subtitles.ilike(f"%{search}%"))

        elif scope == "tag":
            # 仅搜索标签
            query = query.filter(
                or_(
                    Video.tags.contains(search),              # 精确匹配 JSON 数组元素
                    Video.tags.ilike(f"%{search}%"),           # 模糊匹配
                )
            )

        else:  # scope == "all"
            # 全局搜索：标题 + 玩家 + 赛事 + 字幕/手牌 + 标签 + 描述
            q = f"%{search}%"
            query = query.filter(
                or_(
                    Video.title.ilike(q),                     # 标题
                    Video.event.ilike(q),                     # 赛事
                    Video.description.ilike(q),               # 描述
                    Video.tags.contains(search),              # 标签（JSON精确）
                    Video.tags.ilike(q),                      # 标签（模糊）
                    Video.players.contains(search),           # 玩家（JSON精确）
                    Video.players.ilike(q),                   # 玩家（模糊）
                    Video.subtitles.ilike(q),                 # 字幕/手牌
                )
            )

    # 平台过滤
    if platform:
        query = query.filter(Video.platform == platform)

    # 赛事过滤
    if event:
        query = query.filter(Video.event.ilike(f"%{event}%"))

    # 标签过滤
    if tag:
        query = query.filter(Video.tags.contains(tag))

    # 排序
    if sort_by == "oldest":
        query = query.order_by(Video.published_at.asc().nullslast())
    elif sort_by == "views":
        query = query.order_by(desc(Video.views_num))
    else:
        query = query.order_by(Video.published_at.desc().nullslast(), Video.created_at.desc())

    total = query.count()
    videos = query.offset((page - 1) * page_size).limit(page_size).all()

    # 批量查收藏状态
    video_ids = [v.id for v in videos]
    saved_ids = _user_saved_video_ids(user_id, db, video_ids) if user_id else set()

    if is_premium:
        video_items = [
            _build_video_full(v, user_id, saved_ids) for v in videos
        ]
    else:
        # 免费用户：隐藏 url
        video_items = []
        for v in videos:
            data = VideoItemFull.model_validate(v).model_dump()
            data['url'] = None
            data['players'] = []
            data['player_ids'] = []
            data['subtitles'] = None
            data['is_saved'] = False
            video_items.append(data)

    return VideoListResponse(
        total=total,
        page=page,
        page_size=page_size,
        videos=video_items,
    )


# ============ 视频详情 ============

@router.get("/{video_id}")
def get_video_detail(
    video_id: int,
    user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """获取视频详情（付费用户看完整信息）"""
    video = db.query(Video).filter(Video.id == video_id, Video.is_active == 1).first()
    if not video:
        raise HTTPException(status_code=404, detail="视频不存在")

    is_premium = user.is_premium if user else False
    user_id = user.id if user else None
    saved_ids = _user_saved_video_ids(user_id, db, [video_id]) if user_id else set()

    if is_premium:
        return _build_video_full(video, user_id, saved_ids)
    else:
        data = VideoItemFull.model_validate(video).model_dump()
        data['url'] = None
        data['players'] = []
        data['player_ids'] = []
        data['subtitles'] = None
        data['is_saved'] = False
        return data


# ============ 标签列表 ============

@router.get("/meta/tags")
def list_tags(db: Session = Depends(get_db)):
    """获取所有视频标签及使用次数"""
    videos = db.query(Video.tags).filter(
        Video.is_active == 1,
        Video.tags.isnot(None),
    ).all()

    tag_count: dict[str, int] = {}
    for v in videos:
        if v.tags:
            for t in v.tags:
                tag_count[t] = tag_count.get(t, 0) + 1

    return sorted(tag_count.items(), key=lambda x: x[1], reverse=True)


# ============ 统计信息 ============

@router.get("/meta/stats", response_model=VideoStatsResponse)
def video_stats(db: Session = Depends(get_db)):
    """视频库统计信息"""
    total = db.query(func.count(Video.id)).filter(Video.is_active == 1).scalar() or 0

    # 按平台统计
    platform_rows = db.query(Video.platform, func.count(Video.id)).filter(
        Video.is_active == 1,
        Video.platform.isnot(None),
    ).group_by(Video.platform).all()
    by_platform = {r[0]: r[1] for r in platform_rows}

    # 按赛事统计
    event_rows = db.query(Video.event, func.count(Video.id)).filter(
        Video.is_active == 1,
        Video.event.isnot(None),
    ).group_by(Video.event).order_by(desc(func.count(Video.id))).limit(20).all()
    by_event = {r[0]: r[1] for r in event_rows}

    # 近 7 天新增
    seven_days_ago = date.today() - timedelta(days=7)
    recent = db.query(func.count(Video.id)).filter(
        Video.is_active == 1,
        Video.created_at >= datetime.combine(seven_days_ago, datetime.min.time()),
    ).scalar() or 0

    # 总播放量
    total_views_rows = db.query(Video.views_num).filter(
        Video.is_active == 1,
        Video.views_num.isnot(None),
    ).all()
    total_views_num = sum(r[0] or 0 for r in total_views_rows)
    if total_views_num >= 1_000_000:
        total_views_str = f"{total_views_num / 1_000_000:.1f}M"
    elif total_views_num >= 1_000:
        total_views_str = f"{total_views_num / 1_000:.1f}K"
    else:
        total_views_str = str(total_views_num)

    return VideoStatsResponse(
        total_videos=total,
        by_platform=by_platform,
        by_event=by_event,
        recent_count=recent,
        total_views=total_views_str,
    )


# ============ 添加视频（付费用户） ============

@router.post("", response_model=MessageResponse, status_code=201)
def add_video(
    req: VideoAddRequest,
    user: User = Depends(require_premium),
    db: Session = Depends(get_db),
):
    """手动添加视频到视频库（仅付费用户）"""
    # 自动检测平台
    platform = req.platform or _detect_platform(req.url)

    # 自动生成缩略图
    thumbnail = _auto_thumbnail(req.url)

    # 生成唯一 slug
    existing = {v.slug for v in db.query(Video.slug).filter(Video.slug.isnot(None)).all()}
    slug = _generate_slug(req.title, existing)

    # 解析播放量（如果是数字）
    views_num = 0

    video = Video(
        slug=slug,
        title=req.title,
        url=req.url,
        thumbnail=thumbnail,
        platform=platform,
        event=req.event,
        players=req.players or [],
        tags=req.tags or [],
        subtitles=req.subtitles,
        description=req.description,
        views_num=views_num,
    )
    db.add(video)
    db.commit()

    return MessageResponse(message=f"视频 '{req.title}' 已添加", success=True)


# ============ 批量导入视频（付费用户） ============

@router.post("/batch", response_model=MessageResponse, status_code=201)
def batch_import_videos(
    req: VideoBatchImportRequest,
    user: User = Depends(require_premium),
    db: Session = Depends(get_db),
):
    """批量导入视频（仅付费用户）"""
    existing = {v.slug for v in db.query(Video.slug).filter(Video.slug.isnot(None)).all()}
    count = 0

    for item in req.videos:
        platform = item.platform or _detect_platform(item.url)
        thumbnail = _auto_thumbnail(item.url)
        slug = _generate_slug(item.title, existing)

        video = Video(
            slug=slug,
            title=item.title,
            url=item.url,
            thumbnail=thumbnail,
            platform=platform,
            event=item.event,
            players=item.players or [],
            tags=item.tags or [],
            subtitles=item.subtitles,
            description=item.description,
        )
        db.add(video)
        existing.add(slug)
        count += 1

    db.commit()
    return MessageResponse(message=f"成功导入 {count} 个视频", success=True)


# ============ 收藏视频（付费用户） ============

@router.post("/{video_id}/save", response_model=MessageResponse)
def save_video(
    video_id: int,
    user: User = Depends(require_premium),
    db: Session = Depends(get_db),
):
    """收藏视频"""
    video = db.query(Video).filter(Video.id == video_id, Video.is_active == 1).first()
    if not video:
        raise HTTPException(status_code=404, detail="视频不存在")

    existing = db.query(UserVideoSave).filter(
        UserVideoSave.user_id == user.id,
        UserVideoSave.video_id == video_id,
    ).first()

    if existing:
        return MessageResponse(message="已收藏", success=True)

    save = UserVideoSave(user_id=user.id, video_id=video_id)
    db.add(save)
    video.save_count = (video.save_count or 0) + 1
    db.commit()

    return MessageResponse(message="收藏成功", success=True)


@router.delete("/{video_id}/save", response_model=MessageResponse)
def unsave_video(
    video_id: int,
    user: User = Depends(require_premium),
    db: Session = Depends(get_db),
):
    """取消收藏视频"""
    save = db.query(UserVideoSave).filter(
        UserVideoSave.user_id == user.id,
        UserVideoSave.video_id == video_id,
    ).first()

    if not save:
        return MessageResponse(message="未收藏", success=True)

    db.delete(save)
    video = db.query(Video).filter(Video.id == video_id).first()
    if video and video.save_count and video.save_count > 0:
        video.save_count -= 1
    db.commit()

    return MessageResponse(message="已取消收藏", success=True)


# ============ 我的收藏列表 ============

@router.get("/saved/mine", response_model=SavedVideoListResponse)
def list_my_saved_videos(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user: User = Depends(require_premium),
    db: Session = Depends(get_db),
):
    """获取我的收藏视频列表"""
    query = db.query(UserVideoSave).filter(UserVideoSave.user_id == user.id)
    total = query.count()
    saves = query.order_by(desc(UserVideoSave.created_at)).offset(
        (page - 1) * page_size
    ).limit(page_size).all()

    items = []
    for s in saves:
        v = db.query(Video).filter(Video.id == s.video_id, Video.is_active == 1).first()
        if v:
            items.append(UserSavedVideoItem(
                id=s.id,
                video_id=v.id,
                title=v.title,
                thumbnail=v.thumbnail,
                platform=v.platform,
                duration=v.duration,
                event=v.event,
                players=v.players or [],
                tags=v.tags or [],
                url=v.url,
                saved_at=s.created_at,
            ))

    return SavedVideoListResponse(
        total=total,
        page=page,
        page_size=page_size,
        saved_videos=items,
    )
