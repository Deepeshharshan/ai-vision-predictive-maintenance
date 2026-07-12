from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DashboardMetricsSummary(BaseModel):
    productionRate: float
    productionTarget: float
    efficiency: float
    downtime: float
    defects: float
    shiftDefectLimit: float

class RecentActivity(BaseModel):
    id: str
    timestamp: datetime
    user: str
    event: str
    status: str

    model_config = {"from_attributes": True}
