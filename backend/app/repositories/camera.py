from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.fleet import Camera
from app.schemas.camera import CameraCreate, CameraUpdate
from app.repositories.base import CRUDBase

class CRUDCamera(CRUDBase[Camera, CameraCreate, CameraUpdate]):
    async def get_by_filters(
        self, db: AsyncSession, *, location: Optional[str] = None, status: Optional[str] = None, skip: int = 0, limit: int = 100
    ) -> List[Camera]:
        query = select(Camera)
        if location:
            query = query.where(Camera.location.ilike(f"%{location}%"))
        if status and status.lower() != "all":
            query = query.where(Camera.status.ilike(status))
        
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

camera = CRUDCamera(Camera)
