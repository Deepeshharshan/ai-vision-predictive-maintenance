from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.camera import CameraCreate, CameraUpdate, CameraResponse
from app.services.camera import camera_service

router = APIRouter()

@router.get("", response_model=List[CameraResponse])
async def read_cameras(
    db: AsyncSession = Depends(get_db),
    location: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
) -> Any:
    return await camera_service.get_cameras(db, location=location, status=status, skip=skip, limit=limit)

@router.post("", response_model=CameraResponse, status_code=status.HTTP_201_CREATED)
async def create_camera(
    *,
    db: AsyncSession = Depends(get_db),
    camera_in: CameraCreate,
    current_user: User = Depends(get_current_user)
) -> Any:
    return await camera_service.create_camera(db, obj_in=camera_in)

@router.get("/{id}", response_model=CameraResponse)
async def read_camera(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    camera = await camera_service.get_camera(db, id=id)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return camera

@router.patch("/{id}", response_model=CameraResponse)
async def update_camera(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    camera_in: CameraUpdate,
    current_user: User = Depends(get_current_user)
) -> Any:
    camera = await camera_service.update_camera(db, id=id, obj_in=camera_in)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return camera

@router.post("/{id}/restart", response_model=CameraResponse)
async def restart_camera(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    # In reality, this would signal a worker to restart the RTSP connection
    camera = await camera_service.get_camera(db, id=id)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return camera

@router.delete("/{id}", response_model=CameraResponse)
async def delete_camera(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    camera = await camera_service.delete_camera(db, id=id)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return camera
