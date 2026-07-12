from typing import Any, Dict, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert

from app.models.settings import Setting
from app.db.base import get_utc_now

class CRUDSettings:
    async def get_setting(self, db: AsyncSession, key: str) -> Optional[Dict[str, Any]]:
        result = await db.execute(select(Setting).where(Setting.key == key))
        setting = result.scalar_one_or_none()
        if setting:
            return setting.value
        return None

    async def update_setting(self, db: AsyncSession, key: str, value: Dict[str, Any]) -> Dict[str, Any]:
        stmt = insert(Setting).values(key=key, value=value, updated_at=get_utc_now())
        stmt = stmt.on_conflict_do_update(
            index_elements=['key'],
            set_={'value': stmt.excluded.value, 'updated_at': get_utc_now()}
        )
        await db.execute(stmt)
        await db.commit()
        return value

setting = CRUDSettings()
