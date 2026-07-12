from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

class MaintenanceBase(BaseModel):
    scheduled_date: Optional[date] = None
    type: str
    duration_minutes: Optional[int] = None
    notes: Optional[str] = None
    resolved: bool = False

class MaintenanceCreate(MaintenanceBase):
    machine_id: str
    engineer_id: Optional[str] = None

class MaintenanceResponse(MaintenanceBase):
    id: str
    machine_id: str
    engineer_id: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}

class MachineMetrics(BaseModel):
    temperature: float = 0.0
    vibration: float = 0.0
    voltage: float = 0.0
    pressure: float = 0.0

class MachineBase(BaseModel):
    name: str
    type: str
    location: str
    status: str = "offline"

class MachineCreate(MachineBase):
    assigned_camera_id: Optional[str] = None

class MachineUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    assigned_camera_id: Optional[str] = None

class MachineResponse(MachineBase):
    id: str
    last_updated: datetime
    assigned_camera_id: Optional[str] = None
    next_maintenance_date: Optional[date] = None
    operating_hours: float
    mtbf: Optional[str] = None
    metrics: MachineMetrics = MachineMetrics()
    maintenance: List[MaintenanceResponse] = []

    model_config = {"from_attributes": True}
