from typing import Any, List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.report import ReportResponse, ReportCreate, ReportAccepted
from app.services.report import report_service

router = APIRouter()

@router.get("", response_model=List[ReportResponse])
async def read_reports(
    db: AsyncSession = Depends(get_db),
    period: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
) -> Any:
    return await report_service.get_reports(db, period=period, skip=skip, limit=limit)

@router.post("", response_model=ReportAccepted, status_code=status.HTTP_202_ACCEPTED)
async def create_report(
    *,
    db: AsyncSession = Depends(get_db),
    report_in: ReportCreate,
    current_user: User = Depends(get_current_user)
) -> Any:
    # 1. Create DB record
    report = await report_service.generate_report(db, data=report_in, user_id=str(current_user.id))
    
    # 2. Trigger Celery task
    from app.tasks.reports import generate_report_task
    generate_report_task.delay(report.id)
    
    return report

@router.get("/tasks/{task_id}")
async def get_task_status(
    task_id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    from app.core.celery_app import celery_app
    task_result = celery_app.AsyncResult(task_id)
    return {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result if task_result.ready() else None
    }
