from typing import Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.analytics import AnalyticsData, MTBFResponse, DowntimeResponse
from app.services.analytics import analytics_service

router = APIRouter()

@router.get("", response_model=AnalyticsData)
async def read_overview(
    db: AsyncSession = Depends(get_db),
    timeframe: str = Query("7d"),
    current_user: User = Depends(get_current_user)
) -> Any:
    return await analytics_service.get_overview(db, timeframe=timeframe)

@router.get("/mtbf", response_model=MTBFResponse)
async def read_mtbf(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    return await analytics_service.get_mtbf(db)

@router.get("/downtime", response_model=DowntimeResponse)
async def read_downtime(
    db: AsyncSession = Depends(get_db),
    period: str = Query("30d"),
    current_user: User = Depends(get_current_user)
) -> Any:
    return await analytics_service.get_downtime(db, period=period)
