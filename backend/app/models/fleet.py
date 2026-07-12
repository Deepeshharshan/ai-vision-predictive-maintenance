from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String, Float, DateTime, Date, ForeignKey
from datetime import datetime, date
from typing import List, Optional

from app.db.base import Base, generate_uuid, get_utc_now

class Machine(Base):
    __tablename__ = "machines"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String, nullable=False)
    type: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, default="offline")
    last_updated: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=get_utc_now)
    assigned_camera_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("cameras.id"), nullable=True)
    next_maintenance_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    operating_hours: Mapped[float] = mapped_column(Float, default=0.0)
    mtbf: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    camera: Mapped[Optional["Camera"]] = relationship("Camera", foreign_keys=[assigned_camera_id])

class Camera(Base):
    __tablename__ = "cameras"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[str] = mapped_column(String, nullable=False)
    rtsp_url: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, default="offline")
    fps: Mapped[int] = mapped_column(default=30)
    resolution: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    bitrate: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    health: Mapped[float] = mapped_column(Float, default=100.0)
    uptime: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    assigned_machine_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("machines.id"), nullable=True)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
