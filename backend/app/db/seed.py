"""
Database seeder — creates the default admin user and initial settings.
Run inside Docker:  docker compose exec api python -m app.db.seed
"""
import asyncio
import uuid
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select, text

from app.core.config import settings
from app.core.security import get_password_hash
from app.models.user import User
from app.models.settings import Setting


async def seed():
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        # ── Admin User ──────────────────────────────────────────────────────
        result = await session.execute(select(User).where(User.email == "admin@kronos.com"))
        existing_admin = result.scalar_one_or_none()

        if not existing_admin:
            admin = User(
                id=uuid.uuid4(),
                email="admin@kronos.com",
                password_hash=get_password_hash("admin123"),
                name="Kronos Admin",
                role="admin",
                status="active",
                created_at=datetime.now(timezone.utc),
            )
            session.add(admin)
            print("[SEED] Created admin user: admin@kronos.com / admin123")
        else:
            print("[SEED] Admin user already exists — skipping.")

        # ── Default Settings ─────────────────────────────────────────────────
        default_settings = [
            ("company_name", "Kronos Industrial", "Organisation display name"),
            ("alert_email", "alerts@kronos.com", "Email for alert notifications"),
            ("shift_defect_limit", "50", "Max defects allowed per shift"),
            ("production_target", "100", "Production target units per shift"),
        ]

        for key, value, description in default_settings:
            res = await session.execute(select(Setting).where(Setting.key == key))
            if not res.scalar_one_or_none():
                session.add(Setting(
                    id=uuid.uuid4(),
                    key=key,
                    value=value,
                    description=description,
                    updated_at=datetime.now(timezone.utc),
                ))

                print(f"[SEED] Setting '{key}' = '{value}'")

        await session.commit()

    await engine.dispose()
    print("[SEED] ✅ Database seeded successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
