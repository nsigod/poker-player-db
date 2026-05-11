# 选手 API - 分页查询、搜索、排序
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from ..database import get_db
from ..models import User, Player, PlayerResult
from ..schemas import (
    PlayerBasic, PlayerFull, PlayerListResponse,
    PlayerDetailResponse, PlayerResultItem, MessageResponse,
)
from ..auth.deps import get_current_user, get_optional_user, require_premium
from ..config import get_settings

router = APIRouter()


def _parse_earnings(earnings_str: str | None) -> float:
    """将奖金字符串解析为数字（用于排序）"""
    if not earnings_str:
        return 0.0
    cleaned = earnings_str.replace("$", "").replace(",", "").replace(" ", "")
    if cleaned.endswith("M"):
        return float(cleaned[:-1]) * 1_000_000
    if cleaned.endswith("K"):
        return float(cleaned[:-1]) * 1_000
    try:
        return float(cleaned)
    except ValueError:
        return 0.0


@router.get("", response_model=PlayerListResponse)
def list_players(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str = Query(None, description="搜索选手名字"),
    sort_by: str = Query("name", description="排序: name, earnings, titles, cashes, country"),
    sort_order: str = Query("asc", description="排序方向: asc, desc"),
    country: str = Query(None, description="按国籍筛选"),
    request: Request = None,
    db: Session = Depends(get_db),
):
    """获取选手列表（公开接口，返回基础信息）"""
    query = db.query(Player)

    # 搜索
    if search:
        query = query.filter(
            or_(
                Player.name.ilike(f"%{search}%"),
                Player.nickname.ilike(f"%{search}%"),
                Player.country.ilike(f"%{search}%"),
            )
        )

    # 国籍筛选
    if country:
        query = query.filter(Player.country == country)

    # 排序
    if sort_by == "earnings":
        # 按奖金排序需要解析字符串
        if sort_order == "desc":
            players = query.all()
            players.sort(key=lambda p: _parse_earnings(p.total_earnings), reverse=True)
        else:
            players = query.all()
            players.sort(key=lambda p: _parse_earnings(p.total_earnings))
    elif sort_by == "titles":
        col = getattr(Player, "titles")
        order = col.desc() if sort_order == "desc" else col.asc()
        query = query.order_by(order)
        players = query.all()
    elif sort_by == "cashes":
        col = getattr(Player, "cashes")
        order = col.desc() if sort_order == "desc" else col.asc()
        query = query.order_by(order)
        players = query.all()
    elif sort_by == "country":
        col = getattr(Player, "country")
        order = col.desc() if sort_order == "desc" else col.asc()
        query = query.order_by(order, Player.name)
        players = query.all()
    else:
        # 默认按名字排序
        col = getattr(Player, "name")
        order = col.desc() if sort_order == "desc" else col.asc()
        query = query.order_by(order)
        players = query.all()

    total = len(players)
    start = (page - 1) * page_size
    end = start + page_size
    page_players = players[start:end]

    return PlayerListResponse(
        total=total,
        page=page,
        page_size=page_size,
        players=[PlayerBasic.model_validate(p) for p in page_players],
    )


@router.get("/countries")
def list_countries(db: Session = Depends(get_db)):
    """获取所有国籍列表"""
    countries = (
        db.query(Player.country, Player.flag, func.count(Player.id).label("count"))
        .filter(Player.country.isnot(None))
        .group_by(Player.country, Player.flag)
        .order_by(func.count(Player.id).desc())
        .all()
    )
    return [
        {"country": c[0], "flag": c[1], "count": c[2]}
        for c in countries
    ]


@router.get("/{player_id}", response_model=PlayerDetailResponse)
def get_player(
    player_id: int,
    user: User | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """获取选手详情（付费用户可查看完整信息）"""
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="选手不存在")

    is_premium = user.is_premium if user else False

    if is_premium:
        # 付费用户：完整信息 + 比赛记录
        results = (
            db.query(PlayerResult)
            .filter(PlayerResult.player_id == player.id)
            .order_by(PlayerResult.year.desc())
            .all()
        )
        return PlayerDetailResponse(
            player=PlayerFull.model_validate(player),
            results=[PlayerResultItem.model_validate(r) for r in results],
        )
    else:
        # 免费用户：基础信息，隐藏敏感字段
        basic = PlayerBasic(
            id=player.id,
            slug=player.slug,
            name=player.name,
            country=player.country,
            flag=player.flag,
            titles=player.titles,
            cashes=player.cashes,
            total_earnings=player.total_earnings,
        )
        return PlayerDetailResponse(
            player=basic,  # type: ignore
            results=[],
        )
