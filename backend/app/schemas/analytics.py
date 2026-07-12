from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class OEEData(BaseModel):
    day: str
    active: float
    idle: float
    down: float
    oee: float

class DefectCategory(BaseModel):
    label: str
    count: int
    pct: float
    color: str

class AnalyticsData(BaseModel):
    weeklyOEE: List[OEEData]
    defectCategories: List[DefectCategory]
    avgOEE: float

class MTBFItem(BaseModel):
    machineId: str
    name: str
    mtbf: float
    lastFailure: date
    trend: str # up, down, neutral

class MTBFResponse(BaseModel):
    items: List[MTBFItem]

class DowntimeItem(BaseModel):
    date: date
    machine: str
    duration: str
    type: str
    cost: str

class DowntimeResponse(BaseModel):
    items: List[DowntimeItem]
