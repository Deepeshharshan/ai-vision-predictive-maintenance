from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.repositories.camera import camera
from app.schemas.camera import CameraCreate, CameraUpdate
from app.models.fleet import Camera

class CameraService:
    async def get_cameras(self, db: AsyncSession, location: Optional[str] = None, status: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[Camera]:
        return await camera.get_by_filters(db, location=location, status=status, skip=skip, limit=limit)
    
    async def get_camera(self, db: AsyncSession, id: str) -> Optional[Camera]:
        return await camera.get(db, id)
    
    async def create_camera(self, db: AsyncSession, obj_in: CameraCreate) -> Camera:
        return await camera.create(db, obj_in=obj_in)
    
    async def update_camera(self, db: AsyncSession, id: str, obj_in: CameraUpdate) -> Optional[Camera]:
        db_obj = await camera.get(db, id=id)
        if not db_obj:
            return None
        return await camera.update(db, db_obj=db_obj, obj_in=obj_in)
        
    async def delete_camera(self, db: AsyncSession, id: str) -> Optional[Camera]:
        return await camera.remove(db, id=id)

camera_service = CameraService()
