from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class KPI(BaseModel):
    label: str
    value: str
    change: str
    direction: str

class ReportBase(BaseModel):
    type: str # pdf, excel
    period: str # daily, weekly, monthly
    period_date: Optional[str] = None

class ReportCreate(ReportBase):
    pass

class ReportResponse(ReportBase):
    id: str
    status: str
    file_url: Optional[str] = None
    file_size: Optional[int] = None
    kpis: Optional[List[KPI]] = None
    created_at: datetime
    title: str
    date: str

    model_config = {"from_attributes": True}

class ReportAccepted(BaseModel):
    id: str
    status: str
