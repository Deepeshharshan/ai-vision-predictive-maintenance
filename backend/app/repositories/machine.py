from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.fleet import Machine
from app.models.log import Maintenance
from app.schemas.machine import MachineCreate, MachineUpdate
from app.repositories.base import CRUDBase

class CRUDMachine(CRUDBase[Machine, MachineCreate, MachineUpdate]):
    async def get_with_maintenance(self, db: AsyncSession, machine_id: str) -> Optional[Machine]:
        result = await db.execute(
            select(Machine)
            .options(selectinload(Machine.maintenance))
            .where(Machine.id == machine_id)
        )
        return result.scalar_one_or_none()

    async def get_by_filters(
        self, db: AsyncSession, *, status: Optional[str] = None, search: Optional[str] = None, skip: int = 0, limit: int = 100
    ) -> List[Machine]:
        query = select(Machine)
        if status and status.lower() != "all":
            query = query.where(Machine.status.ilike(status))
        if search:
            search_pattern = f"%{search}%"
            query = query.where(Machine.name.ilike(search_pattern) | Machine.id.cast(str).ilike(search_pattern))
        
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

machine = CRUDMachine(Machine)
