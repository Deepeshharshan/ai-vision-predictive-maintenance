import logging
from typing import Any, Dict
from jose import JWTError

from app.socket.manager import sio_server
from app.auth.jwt import decode_access_token

logger = logging.getLogger(__name__)

@sio_server.on("connect")
async def connect(sid: str, environ: Dict[str, Any], auth: Dict[str, Any]):
    if not auth or "token" not in auth:
        logger.warning(f"Connection rejected for {sid}: No token provided")
        return False # Reject connection

    token = auth.get("token")
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        if not user_id:
            return False
            
        # Save user context in session
        await sio_server.save_session(sid, {"user_id": user_id, "role": payload.get("role")})
        logger.info(f"Socket {sid} connected for user {user_id}")
        return True
    except JWTError:
        logger.warning(f"Connection rejected for {sid}: Invalid token")
        return False

@sio_server.on("disconnect")
async def disconnect(sid: str):
    session = await sio_server.get_session(sid)
    user_id = session.get("user_id", "Unknown") if session else "Unknown"
    logger.info(f"Socket {sid} disconnected for user {user_id}")

@sio_server.on("join_room")
async def join_room(sid: str, room: str):
    logger.info(f"Socket {sid} joining room: {room}")
    await sio_server.enter_room(sid, room)

@sio_server.on("leave_room")
async def leave_room(sid: str, room: str):
    logger.info(f"Socket {sid} leaving room: {room}")
    await sio_server.leave_room(sid, room)
