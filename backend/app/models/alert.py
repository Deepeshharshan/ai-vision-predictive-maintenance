from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String, Float, DateTime, Date, ForeignKey, Text
from datetime import datetime
from typing import List, Optional

from app.db.base import Base, generate_uuid, get_utc_now

class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    machine_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("machines.id"), nullable=True)
    camera_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("cameras.id"), nullable=True)
    level: Mapped[str] = mapped_column(String, nullable=False) # error, warn, info
    status: Mapped[str] = mapped_column(String, default="active") # active, acknowledged, resolved
    message: Mapped[str] = mapped_column(Text, nullable=False)
    source: Mapped[str] = mapped_column(String, nullable=False)
    source_type: Mapped[str] = mapped_column(String, nullable=False)
    acknowledged_by: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    acknowledged_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    resolved_by: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=get_utc_now)

class AlertTimeline(Base):
    __tablename__ = "alert_timeline"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    alert_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("alerts.id"), nullable=False)
    time: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=get_utc_now)
    action: Mapped[str] = mapped_column(String, nullable=False)
    actor: Mapped[str] = mapped_column(String, nullable=False)
