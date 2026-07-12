from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy import String, Float, DateTime, Date, ForeignKey, Boolean, Text, BigInteger
from datetime import datetime, date
from typing import Optional

from app.db.base import Base, generate_uuid, get_utc_now

class Analytics(Base):
    __tablename__ = "analytics"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    machine_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("machines.id"), nullable=True)
    period_start: Mapped[date] = mapped_column(Date, nullable=False)
    period_end: Mapped[date] = mapped_column(Date, nullable=False)
    oee: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    defect_rate: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    downtime_minutes: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=get_utc_now)

class Report(Base):
    __tablename__ = "reports"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    generated_by: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    type: Mapped[str] = mapped_column(String, nullable=False) # pdf, excel
    period: Mapped[str] = mapped_column(String, nullable=False) # daily, weekly, monthly
    period_date: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="queued") # queued, generating, ready, failed
    file_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    file_size: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    kpis: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=get_utc_now)
