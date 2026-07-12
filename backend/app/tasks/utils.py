import asyncio
from typing import Coroutine, Any

def async_to_sync(coro: Coroutine) -> Any:
    """
    Utility to safely run async functions inside Celery synchronous tasks.
    Creates a new event loop for the current thread and runs the coroutine.
    """
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()
