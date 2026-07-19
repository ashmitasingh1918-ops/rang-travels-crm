from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from backend.app.core.database import get_db
from backend.app.core.dependencies import get_current_user
from backend.app.modules.leads import crud, schemas

router = APIRouter()

@router.post("/", response_model=schemas.LeadResponse)
async def create_lead(lead: schemas.LeadCreate, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return await crud.create_lead(db=db, lead=lead)

@router.get("/", response_model=List[schemas.LeadResponse])
async def read_leads(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return await crud.get_leads(db=db, skip=skip, limit=limit)
