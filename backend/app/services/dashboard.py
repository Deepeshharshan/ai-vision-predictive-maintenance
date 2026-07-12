from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Dict, Any

from app.schemas.dashboard import DashboardMetricsSummary
from app.models.fleet import Machine
from app.models.alert import Alert


class DashboardService:
    async def get_metrics(self, db: AsyncSession) -> DashboardMetricsSummary:
        # Count machines by status
        machine_result = await db.execute(
            select(Machine.status, func.count(Machine.id)).group_by(Machine.status)
        )
        status_counts: Dict[str, int] = {row[0]: row[1] for row in machine_result.all()}

        total_machines = sum(status_counts.values()) or 1
        running = status_counts.get("running", 0)
        warning = status_counts.get("warning", 0)
        critical = status_counts.get("critical", 0)
        offline = status_counts.get("offline", 0)

        # Efficiency: ratio of healthy machines to total
        efficiency = round((running / total_machines) * 100, 1)

        # Active alert count as a defect proxy
        alert_result = await db.execute(
            select(func.count(Alert.id)).where(Alert.status == "active")
        )
        active_alerts = alert_result.scalar_one() or 0

        # Downtime: offline + critical machines as a percentage of total shift minutes (480)
        downtime_minutes = round(((offline + critical) / total_machines) * 480, 1)

        return DashboardMetricsSummary(
            productionRate=round((running / total_machines) * 100, 1),
            productionTarget=100.0,
            efficiency=efficiency,
            downtime=downtime_minutes,
            defects=float(active_alerts),
            shiftDefectLimit=50.0,
        )


dashboard_service = DashboardService()
