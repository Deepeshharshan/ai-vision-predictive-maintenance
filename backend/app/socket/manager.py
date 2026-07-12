import socketio
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

# Try to use Redis manager, fallback to in-memory if Redis url is unavailable or invalid
try:
    if settings.REDIS_URL:
        client_manager = socketio.AsyncRedisManager(settings.REDIS_URL)
        logger.info(f"Initialized Socket.IO with RedisManager at {settings.REDIS_URL}")
    else:
        client_manager = None
        logger.info("Initialized Socket.IO with in-memory manager (No REDIS_URL)")
except Exception as e:
    logger.warning(f"Failed to initialize RedisManager: {e}. Falling back to in-memory manager.")
    client_manager = None

sio_server = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    client_manager=client_manager,
    logger=False,
    engineio_logger=False
)
