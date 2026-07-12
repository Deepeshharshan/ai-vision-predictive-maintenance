from celery import Celery
from celery.schedules import crontab
from app.core.config import settings

celery_app = Celery(
    "worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
)

# Celery Beat Schedule
celery_app.conf.beat_schedule = {
    "aggregate-analytics-nightly": {
        "task": "app.tasks.analytics.aggregate_daily_metrics_task",
        "schedule": crontab(hour=0, minute=0), # Midnight every day
    },
    "purge-old-logs-weekly": {
        "task": "app.tasks.cleanup.purge_old_activity_logs_task",
        "schedule": crontab(day_of_week="sunday", hour=2, minute=0),
    }
}
