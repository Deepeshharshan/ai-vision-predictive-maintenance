import time
import logging
from app.core.celery_app import celery_app
from app.tasks.utils import async_to_sync
from app.db.database import AsyncSessionLocal
from sqlalchemy import update
from app.models.analytics import Report

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, max_retries=3, default_retry_delay=30)
def generate_report_task(self, report_id: str):
    logger.info(f"Starting generation for report {report_id}")
    
    # Simulate heavy processing (PDF generation)
    time.sleep(5)
    
    # Update DB status
    async def _update_db():
        async with AsyncSessionLocal() as db:
            stmt = update(Report).where(Report.id == report_id).values(
                status="ready",
                file_url=f"https://kronos.app/reports/{report_id}.pdf"
            )
            await db.execute(stmt)
            await db.commit()
            
    async_to_sync(_update_db())
    logger.info(f"Finished report {report_id}")
    return {"status": "success", "report_id": report_id}
