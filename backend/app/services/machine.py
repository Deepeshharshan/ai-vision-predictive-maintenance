from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.repositories.machine import machine
from app.schemas.machine import MachineCreate, MachineUpdate
from app.models.fleet import Machine

class MachineService:
    async def get_machines(self, db: AsyncSession, status: Optional[str] = None, search: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[Machine]:
        return await machine.get_by_filters(db, status=status, search=search, skip=skip, limit=limit)
    
    async def get_machine(self, db: AsyncSession, id: str) -> Optional[Machine]:
        return await machine.get_with_maintenance(db, id)
    
    async def create_machine(self, db: AsyncSession, obj_in: MachineCreate) -> Machine:
        return await machine.create(db, obj_in=obj_in)
    
    async def update_machine(self, db: AsyncSession, id: str, obj_in: MachineUpdate) -> Optional[Machine]:
        db_obj = await machine.get(db, id=id)
        if not db_obj:
            return None
        return await machine.update(db, db_obj=db_obj, obj_in=obj_in)
        
    async def delete_machine(self, db: AsyncSession, id: str) -> Optional[Machine]:
        return await machine.remove(db, id=id)

machine_service = MachineService()
