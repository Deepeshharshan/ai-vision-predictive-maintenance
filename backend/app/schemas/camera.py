from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Detection(BaseModel):
    label: str
    confidence: float
    box: List[float] # x, y, w, h

class CameraBase(BaseModel):
    name: str
    location: str
    rtsp_url: str
    status: str = "offline"

class CameraCreate(CameraBase):
    assigned_machine_id: Optional[str] = None

class CameraUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    rtsp_url: Optional[str] = None
    status: Optional[str] = None
    assigned_machine_id: Optional[str] = None

class CameraResponse(CameraBase):
    id: str
    fps: int
    resolution: Optional[str] = None
    bitrate: Optional[str] = None
    health: float
    uptime: Optional[str] = None
    assigned_machine_id: Optional[str] = None
    detections: List[Detection] = []

    model_config = {"from_attributes": True}
