from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String, Float, DateTime, Date, ForeignKey, Boolean, Text, Integer
from datetime import datetime, date
from typing import Optional

from app.db.base import Base, generate_uuid, get_utc_now

class Maintenance(Base):
    __tablename__ = "maintenance"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    machine_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("machines.id"), nullable=False)
    engineer_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    scheduled_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    type: Mapped[str] = mapped_column(String, nullable=False) # Preventative, Emergency, Inspection, Corrective
    duration_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    resolved: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=get_utc_now)

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    user_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    event: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=get_utc_now)
