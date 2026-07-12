from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
from datetime import date, timedelta

from app.schemas.analytics import AnalyticsData, MTBFResponse, DowntimeResponse, OEEData, DefectCategory, MTBFItem, DowntimeItem

class AnalyticsService:
    async def get_overview(self, db: AsyncSession, timeframe: str) -> AnalyticsData:
        # Simulate Analytics data based on timeframe
        return AnalyticsData(
            weeklyOEE=[
                OEEData(day="Mon", active=70, idle=20, down=10, oee=85),
                OEEData(day="Tue", active=75, idle=15, down=10, oee=88),
            ],
            defectCategories=[
                DefectCategory(label="Surface Scratches", count=145, pct=45, color="#ef4444"),
                DefectCategory(label="Misalignment", count=85, pct=25, color="#f97316"),
            ],
            avgOEE=86.5
        )

    async def get_mtbf(self, db: AsyncSession) -> MTBFResponse:
        return MTBFResponse(
            items=[
                MTBFItem(machineId="m-1", name="CNC Machine Alpha", mtbf=450.5, lastFailure=date.today() - timedelta(days=5), trend="up"),
                MTBFItem(machineId="m-2", name="Welding Robot 1", mtbf=320.0, lastFailure=date.today() - timedelta(days=12), trend="down")
            ]
        )

    async def get_downtime(self, db: AsyncSession, period: str) -> DowntimeResponse:
        return DowntimeResponse(
            items=[
                DowntimeItem(date=date.today(), machine="CNC Machine Alpha", duration="2h 15m", type="Unplanned", cost="$1,250"),
                DowntimeItem(date=date.today() - timedelta(days=1), machine="Welding Robot 1", duration="4h 00m", type="Planned", cost="$800")
            ]
        )

analytics_service = AnalyticsService()
