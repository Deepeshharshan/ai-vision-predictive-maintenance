from pydantic import BaseModel
from typing import Any, Dict

class SettingUpdate(BaseModel):
    value: Dict[str, Any]

class NotificationSettings(BaseModel):
    emailEnabled: bool
    emailAddress: str
    smsEnabled: bool
    smsNumber: str
    slackEnabled: bool
    slackWebhook: str
    criticalOnly: bool
    alertThrottleMin: int

class CameraSettings(BaseModel):
    defaultFps: int
    defaultResolution: str
    aiConfidenceThreshold: int
    retentionDays: int
    recordingEnabled: bool
    motionDetection: bool

class CompanySettings(BaseModel):
    name: str
    address: str
    timezone: str
