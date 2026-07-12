from fastapi import APIRouter
from app.api.v1 import auth, machines, cameras, alerts, dashboard, analytics, reports, settings

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(machines.router, prefix="/machines", tags=["machines"])
api_router.include_router(cameras.router, prefix="/cameras", tags=["cameras"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
