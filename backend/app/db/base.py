import uuid
from datetime import datetime, timezone
from typing import Any
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

class Base(DeclarativeBase):
    id: Any
    __name__: str

    # Generate __tablename__ automatically
    @classmethod
    def __declare_last__(cls):
        pass

def generate_uuid():
    return uuid.uuid4()

def get_utc_now():
    return datetime.now(timezone.utc)
