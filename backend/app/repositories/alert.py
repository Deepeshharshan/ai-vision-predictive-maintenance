from typing import List, Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.alert import Alert, AlertTimeline
from app.schemas.alert import AlertCreate, AlertUpdate
from app.repositories.base import CRUDBase

class CRUDAlert(CRUDBase[Alert, AlertCreate, AlertUpdate]):
    async def get_with_timeline(self, db: AsyncSession, alert_id: str) -> Optional[Alert]:
        result = await db.execute(
            select(Alert)
            .options(selectinload(Alert.timeline))
            .where(Alert.id == alert_id)
        )
        return result.scalar_one_or_none()

    async def get_by_filters(
        self, db: AsyncSession, *, level: Optional[str] = None, status: Optional[str] = None, search: Optional[str] = None, skip: int = 0, limit: int = 100
    ) -> List[Alert]:
        # Always eagerly load timeline to match schema
        query = select(Alert).options(selectinload(Alert.timeline))
        
        if level and level.lower() != "all":
            query = query.where(Alert.level.ilike(level))
        if status and status.lower() != "all":
            query = query.where(Alert.status.ilike(status))
        if search:
            query = query.where(Alert.message.ilike(f"%{search}%") | Alert.id.cast(str).ilike(f"%{search}%"))
            
        query = query.order_by(desc(Alert.created_at)).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def add_timeline_entry(self, db: AsyncSession, *, alert_id: str, action: str, actor: str) -> AlertTimeline:
        entry = AlertTimeline(alert_id=alert_id, action=action, actor=actor)
        db.add(entry)
        await db.commit()
        await db.refresh(entry)
        return entry

# Create dummy update schema for Alert CRUD
class AlertUpdateDummy(AlertCreate):
    status: Optional[str] = None
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[str] = None
    resolved_by: Optional[str] = None
    resolved_at: Optional[str] = None
    notes: Optional[str] = None

alert = CRUDAlert(Alert)
