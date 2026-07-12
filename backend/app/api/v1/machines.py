from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.machine import MachineCreate, MachineUpdate, MachineResponse
from app.services.machine import machine_service

router = APIRouter()

@router.get("", response_model=List[MachineResponse])
async def read_machines(
    db: AsyncSession = Depends(get_db),
    status: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
) -> Any:
    return await machine_service.get_machines(db, status=status, search=search, skip=skip, limit=limit)

@router.post("", response_model=MachineResponse, status_code=status.HTTP_201_CREATED)
async def create_machine(
    *,
    db: AsyncSession = Depends(get_db),
    machine_in: MachineCreate,
    current_user: User = Depends(get_current_user)
) -> Any:
    return await machine_service.create_machine(db, obj_in=machine_in)

@router.get("/{id}", response_model=MachineResponse)
async def read_machine(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    machine = await machine_service.get_machine(db, id=id)
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return machine

@router.patch("/{id}", response_model=MachineResponse)
async def update_machine(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    machine_in: MachineUpdate,
    current_user: User = Depends(get_current_user)
) -> Any:
    machine = await machine_service.update_machine(db, id=id, obj_in=machine_in)
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return machine

@router.delete("/{id}", response_model=MachineResponse)
async def delete_machine(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    machine = await machine_service.delete_machine(db, id=id)
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return machine
