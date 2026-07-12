import logging
from app.core.celery_app import celery_app
from app.tasks.utils import async_to_sync

logger = logging.getLogger(__name__)

@celery_app.task
def aggregate_daily_metrics_task():
    logger.info("Aggregating daily metrics...")
    
    async def _run_aggregation():
        # In Phase 4, this would query raw telemetry over the last 24h, compute OEE/MTBF, 
        # and insert into the Analytics table.
        pass
        
    async_to_sync(_run_aggregation())
    return "Aggregation complete"
