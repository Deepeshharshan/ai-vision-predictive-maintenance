from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AlertTimelineBase(BaseModel):
    action: str
    actor: str
    time: datetime

class AlertTimelineResponse(AlertTimelineBase):
    id: str

    model_config = {"from_attributes": True}

class AlertBase(BaseModel):
    level: str
    message: str
    source: str
    source_type: str

class AlertCreate(AlertBase):
    machine_id: Optional[str] = None
    camera_id: Optional[str] = None

class AlertAcknowledge(BaseModel):
    pass # Empty request body, gets user ID from token

class AlertResolve(BaseModel):
    notes: str

class AlertBulkAcknowledge(BaseModel):
    ids: List[str]

class AlertResponse(AlertBase):
    id: str
    status: str
    machine_id: Optional[str] = None
    camera_id: Optional[str] = None
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[datetime] = None
    resolved_by: Optional[str] = None
    resolved_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime
    timeline: List[AlertTimelineResponse] = []

    model_config = {"from_attributes": True}
