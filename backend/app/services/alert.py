from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime, timezone
from app.repositories.alert import alert, AlertUpdateDummy
from app.schemas.alert import AlertCreate
from app.models.alert import Alert

class AlertService:
    async def get_alerts(self, db: AsyncSession, level: Optional[str] = None, status: Optional[str] = None, search: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[Alert]:
        return await alert.get_by_filters(db, level=level, status=status, search=search, skip=skip, limit=limit)
    
    async def get_alert(self, db: AsyncSession, id: str) -> Optional[Alert]:
        return await alert.get_with_timeline(db, id)
    
    async def create_alert(self, db: AsyncSession, obj_in: AlertCreate) -> Alert:
        new_alert = await alert.create(db, obj_in=obj_in)
        await alert.add_timeline_entry(db, alert_id=str(new_alert.id), action="Alert Created", actor="System")
        return new_alert

    async def acknowledge_alert(self, db: AsyncSession, id: str, user_id: str) -> Optional[Alert]:
        db_obj = await alert.get(db, id=id)
        if not db_obj or db_obj.status != "active":
            return db_obj
        
        now = datetime.now(timezone.utc)
        update_data = AlertUpdateDummy(
            level=db_obj.level,
            message=db_obj.message,
            source=db_obj.source,
            source_type=db_obj.source_type,
            status="acknowledged",
            acknowledged_by=user_id,
            acknowledged_at=now
        )
        updated = await alert.update(db, db_obj=db_obj, obj_in=update_data)
        await alert.add_timeline_entry(db, alert_id=id, action="Acknowledged", actor=user_id)
        return updated

    async def resolve_alert(self, db: AsyncSession, id: str, user_id: str, notes: str) -> Optional[Alert]:
        db_obj = await alert.get(db, id=id)
        if not db_obj or db_obj.status == "resolved":
            return db_obj
        
        now = datetime.now(timezone.utc)
        update_data = AlertUpdateDummy(
            level=db_obj.level,
            message=db_obj.message,
            source=db_obj.source,
            source_type=db_obj.source_type,
            status="resolved",
            resolved_by=user_id,
            resolved_at=now,
            notes=notes
        )
        updated = await alert.update(db, db_obj=db_obj, obj_in=update_data)
        await alert.add_timeline_entry(db, alert_id=id, action="Resolved", actor=user_id)
        return updated

alert_service = AlertService()
