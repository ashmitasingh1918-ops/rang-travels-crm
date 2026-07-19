from fastapi import APIRouter, Depends
from backend.app.core.dependencies import get_current_user

router = APIRouter()

@router.get("/")
async def get_all(current_user: dict = Depends(get_current_user)):
    return {"module": "staff", "status": "operational", "items": []}
