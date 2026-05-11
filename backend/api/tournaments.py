# 赛事 API
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Tournament, TournamentEvent, TournamentEventResult
from ..schemas import (
    TournamentBasic, TournamentFull, TournamentListResponse,
    TournamentEventItem, TournamentEventResultItem,
)
from ..auth.deps import get_optional_user

router = APIRouter()


@router.get("", response_model=TournamentListResponse)
def list_tournaments(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    year: int = Query(None, description="按年份筛选"),
    search: str = Query(None, description="搜索赛事名称/地点"),
    db: Session = Depends(get_db),
):
    """获取赛事列表（公开接口）"""
    query = db.query(Tournament)

    if year:
        query = query.filter(Tournament.year == year)

    if search:
        query = query.filter(
            Tournament.name.ilike(f"%{search}%")
            | Tournament.location.ilike(f"%{search}%")
        )

    total = query.count()
    tournaments = (
        query.order_by(Tournament.year.desc(), Tournament.start_date.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return TournamentListResponse(
        total=total,
        page=page,
        page_size=page_size,
        tournaments=[TournamentBasic.model_validate(t) for t in tournaments],
    )


@router.get("/years")
def list_years(db: Session = Depends(get_db)):
    """获取所有赛事年份"""
    years = (
        db.query(Tournament.year)
        .distinct()
        .order_by(Tournament.year.desc())
        .all()
    )
    return [y[0] for y in years if y[0]]


@router.get("/{tournament_id}")
def get_tournament(
    tournament_id: int,
    user: User | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """获取赛事详情（付费用户可查看完整信息+子事件）"""
    tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="赛事不存在")

    is_premium = user.is_premium if user else False

    if is_premium:
        # 付费用户：完整信息 + 子事件
        events = (
            db.query(TournamentEvent)
            .filter(TournamentEvent.tournament_id == tournament.id)
            .order_by(TournamentEvent.date)
            .all()
        )

        event_list = []
        for e in events:
            results = (
                db.query(TournamentEventResult)
                .filter(TournamentEventResult.event_id == e.id)
                .order_by(TournamentEventResult.placing)
                .all()
            )
            event_data = TournamentEventItem.model_validate(e)
            event_list.append(event_data)

        full = TournamentFull.model_validate(tournament)
        full.event_list = event_list
        return full
    else:
        # 免费用户：基础信息
        return TournamentBasic.model_validate(tournament)
