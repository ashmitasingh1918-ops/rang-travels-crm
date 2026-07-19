from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.modules.leads.models import Lead
from backend.app.modules.leads.schemas import LeadCreate

async def get_lead(db: AsyncSession, lead_id: int):
    result = await db.execute(select(Lead).filter(Lead.id == lead_id))
    return result.scalars().first()

async def get_leads(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(Lead).offset(skip).limit(limit))
    return result.scalars().all()

async def create_lead(db: AsyncSession, lead: LeadCreate):
    db_lead = Lead(**lead.model_dump())
    db.add(db_lead)
    await db.commit()
    await db.refresh(db_lead)
    return db_lead
