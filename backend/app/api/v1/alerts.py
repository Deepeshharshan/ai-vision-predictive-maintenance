from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.alert import AlertResponse, AlertCreate, AlertAcknowledge, AlertResolve, AlertBulkAcknowledge
from app.services.alert import alert_service

router = APIRouter()

@router.get("", response_model=List[AlertResponse])
async def read_alerts(
    db: AsyncSession = Depends(get_db),
    level: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
) -> Any:
    return await alert_service.get_alerts(db, level=level, status=status, search=search, skip=skip, limit=limit)

@router.get("/{id}", response_model=AlertResponse)
async def read_alert(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    alert = await alert_service.get_alert(db, id=id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.post("/{id}/acknowledge", response_model=AlertResponse)
async def acknowledge_alert(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    alert = await alert_service.acknowledge_alert(db, id=id, user_id=str(current_user.id))
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found or cannot be acknowledged")
    return alert

@router.post("/{id}/resolve", response_model=AlertResponse)
async def resolve_alert(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    data: AlertResolve,
    current_user: User = Depends(get_current_user)
) -> Any:
    alert = await alert_service.resolve_alert(db, id=id, user_id=str(current_user.id), notes=data.notes)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found or cannot be resolved")
    return alert

@router.post("/bulk-acknowledge", response_model=List[str])
async def bulk_acknowledge(
    *,
    db: AsyncSession = Depends(get_db),
    data: AlertBulkAcknowledge,
    current_user: User = Depends(get_current_user)
) -> Any:
    success_ids = []
    for id in data.ids:
        alert = await alert_service.acknowledge_alert(db, id=id, user_id=str(current_user.id))
        if alert:
            success_ids.append(id)
    return success_ids
