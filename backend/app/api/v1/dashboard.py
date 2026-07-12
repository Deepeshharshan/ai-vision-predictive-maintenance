from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
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
    # Return mock recent activities for now
    return [
        RecentActivity(
            id="1",
            timestamp=datetime.now(),
            user="System",
            event="Machine m-1 status changed to OFFLINE",
            status="error"
        )
    ]
