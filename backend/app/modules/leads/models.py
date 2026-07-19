from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from backend.app.core.database import Base

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String(100), nullable=False)
    email = Column(String(100), index=True)
    phone = Column(String(20))
    destination = Column(String(50))
    status = Column(String(30), default="new")
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
