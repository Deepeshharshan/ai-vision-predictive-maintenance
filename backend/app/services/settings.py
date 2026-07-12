from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, Optional

from app.schemas.settings import NotificationSettings, CameraSettings, CompanySettings
from app.repositories.settings import setting

class SettingsService:
    async def get_notifications(self, db: AsyncSession) -> NotificationSettings:
        val = await setting.get_setting(db, "notifications")
        if not val:
            return NotificationSettings(emailEnabled=False, emailAddress="", smsEnabled=False, smsNumber="", slackEnabled=False, slackWebhook="", criticalOnly=True, alertThrottleMin=15)
        return NotificationSettings(**val)

    async def update_notifications(self, db: AsyncSession, data: NotificationSettings) -> NotificationSettings:
        val = await setting.update_setting(db, "notifications", data.model_dump())
        return NotificationSettings(**val)

    async def get_camera_defaults(self, db: AsyncSession) -> CameraSettings:
        val = await setting.get_setting(db, "cameras")
        if not val:
            return CameraSettings(defaultFps=30, defaultResolution="1080p", aiConfidenceThreshold=85, retentionDays=30, recordingEnabled=True, motionDetection=True)
        return CameraSettings(**val)

    async def update_camera_defaults(self, db: AsyncSession, data: CameraSettings) -> CameraSettings:
        val = await setting.update_setting(db, "cameras", data.model_dump())
        return CameraSettings(**val)

    async def get_company(self, db: AsyncSession) -> CompanySettings:
        val = await setting.get_setting(db, "company")
        if not val:
            return CompanySettings(name="Acme Corp", address="123 Industrial Way", timezone="UTC")
        return CompanySettings(**val)

    async def update_company(self, db: AsyncSession, data: CompanySettings) -> CompanySettings:
        val = await setting.update_setting(db, "company", data.model_dump())
        return CompanySettings(**val)

settings_service = SettingsService()
