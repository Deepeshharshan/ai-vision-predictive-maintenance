from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.log import ActivityLog
from app.schemas.dashboard import DashboardMetricsSummary, RecentActivity
from app.services.dashboard import dashboard_service

router = APIRouter()

@router.get("/metrics", response_model=DashboardMetricsSummary)
async def read_metrics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    return await dashboard_service.get_metrics(db)

@router.get("/activities", response_model=List[RecentActivity])
async def read_activities(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(
        select(ActivityLog)
        .order_by(ActivityLog.created_at.desc())
        .limit(20)
    )
    logs = result.scalars().all()
    return [
        RecentActivity(
            id=str(log.id),
            timestamp=log.created_at,
            user=str(log.user_id) if log.user_id else "System",
            event=log.event,
            status=log.status,
        )
        for log in logs
    ]
