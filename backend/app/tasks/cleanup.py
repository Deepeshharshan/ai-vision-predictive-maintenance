import logging
from app.core.celery_app import celery_app
from app.tasks.utils import async_to_sync
from app.db.database import AsyncSessionLocal
from sqlalchemy import delete
from app.models.log import ActivityLog
from datetime import datetime, timedelta, timezone

logger = logging.getLogger(__name__)

@celery_app.task
def purge_old_activity_logs_task():
    logger.info("Purging old activity logs...")
    
    async def _purge():
        async with AsyncSessionLocal() as db:
            thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
            stmt = delete(ActivityLog).where(ActivityLog.created_at < thirty_days_ago)
            await db.execute(stmt)
            await db.commit()
            
    async_to_sync(_purge())
    return "Purge complete"
