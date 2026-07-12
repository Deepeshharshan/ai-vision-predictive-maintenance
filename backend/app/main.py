from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/api/v1/healthz", tags=["health"])
async def health_check():
    return {"status": "ok"}

app.include_router(api_router, prefix=settings.API_V1_STR)

import socketio
from app.socket.manager import sio_server
from app.socket import events # ensure events are registered

# Wrap FastAPI app with Socket.IO ASGI app
sio_app = socketio.ASGIApp(sio_server, app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:sio_app", host="0.0.0.0", port=4000, reload=True)
