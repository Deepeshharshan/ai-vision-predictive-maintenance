import asyncio
import logging
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from redis import asyncio as aioredis
import json
from app.core.config import settings
from app.workers.generators import generate_machine_telemetry
from app.workers.vision import generate_camera_status
from app.db.database import AsyncSessionLocal
from app.models.fleet import Machine, Camera
from sqlalchemy import select

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("TelemetryWorker")

async def get_active_entities():
    async with AsyncSessionLocal() as db:
        machines = (await db.execute(select(Machine))).scalars().all()
        cameras = (await db.execute(select(Camera))).scalars().all()
        
        machine_ids = [str(m.id) for m in machines] if machines else ["m-1", "m-2", "m-3"] # fallback
        camera_ids = [str(c.id) for c in cameras] if cameras else ["c-1", "c-2"]
        
        return machine_ids, camera_ids

async def run_worker():
    logger.info(f"Starting Telemetry & Vision Worker. Connecting to Redis: {settings.REDIS_URL}")
    try:
        redis = aioredis.from_url(settings.REDIS_URL)
        await redis.ping()
        logger.info("Successfully connected to Redis Pub/Sub.")
    except Exception as e:
        logger.error(f"Failed to connect to Redis: {e}")
        return

    tick_rate = 1.5 # seconds

    while True:
        try:
            machine_ids, camera_ids = await get_active_entities()
            
            for m_id in machine_ids:
                telemetry = generate_machine_telemetry(m_id)
                # Publish to Redis channel that python-socketio listens to
                # The room format is machine:{id}
                payload = {
                    "method": "emit",
                    "event": "telemetry:update",
                    "data": telemetry,
                    "namespace": "/",
                    "room": f"machine:{m_id}"
                }
                # python-socketio uses a specific redis channel format: socketio
                await redis.publish("socketio", json.dumps(payload))
                
            for c_id in camera_ids:
                camera_status = generate_camera_status(c_id)
                payload = {
                    "method": "emit",
                    "event": "camera:status",
                    "data": camera_status,
                    "namespace": "/",
                    "room": f"camera:{c_id}"
                }
                await redis.publish("socketio", json.dumps(payload))
                
            await asyncio.sleep(tick_rate)
            
        except Exception as e:
            logger.error(f"Error in worker loop: {e}")
            await asyncio.sleep(5)

if __name__ == "__main__":
    asyncio.run(run_worker())
