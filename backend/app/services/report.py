from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from app.schemas.report import ReportCreate, ReportResponse, ReportAccepted, KPI
from app.models.analytics import Report


class ReportService:
    async def get_reports(
        self, db: AsyncSession, period: Optional[str] = None, skip: int = 0, limit: int = 100
    ) -> List[ReportResponse]:
        query = select(Report).order_by(Report.created_at.desc()).offset(skip).limit(limit)
        if period:
            query = query.where(Report.period == period)
        result = await db.execute(query)
        reports = result.scalars().all()
        return [
            ReportResponse(
                id=str(r.id),
                type=r.type,
                period=r.period,
                status=r.status,
                file_url=r.file_url,
                file_size=r.file_size,
                kpis=[],  # populated by worker after generation
                created_at=r.created_at,
                title=r.title,
                date=r.created_at.strftime("%Y-%m-%d"),
            )
            for r in reports
        ]

    async def generate_report(
        self, db: AsyncSession, data: ReportCreate, user_id: str
    ) -> ReportAccepted:
        new_id = uuid.uuid4()
        report = Report(
            id=new_id,
            title=data.title or f"{data.period.capitalize()} Report",
            type=data.type,
            period=data.period,
            status="queued",
            requested_by_id=uuid.UUID(user_id) if user_id else None,
            created_at=datetime.now(timezone.utc),
        )
        db.add(report)
        await db.commit()
        return ReportAccepted(id=str(new_id), status="queued")


report_service = ReportService()
