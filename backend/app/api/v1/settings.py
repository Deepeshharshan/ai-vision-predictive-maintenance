from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.api.deps import get_current_user, require_role
from app.models.user import User
from app.schemas.settings import NotificationSettings, CameraSettings, CompanySettings
from app.services.settings import settings_service

router = APIRouter()

@router.get("/notifications", response_model=NotificationSettings)
async def read_notifications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    return await settings_service.get_notifications(db)

@router.put("/notifications", response_model=NotificationSettings)
async def update_notifications(
    *,
    db: AsyncSession = Depends(get_db),
    data: NotificationSettings,
    current_user: User = Depends(require_role(["admin"]))
) -> Any:
    return await settings_service.update_notifications(db, data)

@router.get("/cameras", response_model=CameraSettings)
async def read_cameras(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    return await settings_service.get_camera_defaults(db)

@router.put("/cameras", response_model=CameraSettings)
async def update_cameras(
    *,
    db: AsyncSession = Depends(get_db),
    data: CameraSettings,
    current_user: User = Depends(require_role(["admin"]))
) -> Any:
    return await settings_service.update_camera_defaults(db, data)

@router.get("/company", response_model=CompanySettings)
async def read_company(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    return await settings_service.get_company(db)

@router.put("/company", response_model=CompanySettings)
async def update_company(
    *,
    db: AsyncSession = Depends(get_db),
    data: CompanySettings,
    current_user: User = Depends(require_role(["admin"]))
) -> Any:
    return await settings_service.update_company(db, data)
