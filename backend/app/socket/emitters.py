import logging
from typing import Dict, Any

from app.socket.manager import sio_server

logger = logging.getLogger(__name__)

class EmitterService:
    async def broadcast_machine_telemetry(self, machine_id: str, data: Dict[str, Any]):
        """Emit telemetry updates to all clients subscribed to a specific machine"""
        room = f"machine:{machine_id}"
        event = "telemetry:update"
        await sio_server.emit(event, data, room=room)
        
    async def broadcast_camera_status(self, camera_id: str, data: Dict[str, Any]):
        """Emit camera status/detection updates"""
        room = f"camera:{camera_id}"
        event = "camera:status"
        await sio_server.emit(event, data, room=room)

    async def broadcast_alert(self, data: Dict[str, Any]):
        """Emit new alerts to everyone"""
        event = "alert:new"
        await sio_server.emit(event, data)
        
    async def broadcast_dashboard_metrics(self, data: Dict[str, Any]):
        """Emit updated dashboard metrics to everyone"""
        event = "dashboard:metrics"
        await sio_server.emit(event, data)

emitter = EmitterService()
