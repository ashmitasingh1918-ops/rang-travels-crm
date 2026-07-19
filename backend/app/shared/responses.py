from pydantic import BaseModel, Field
from typing import Any, Optional, Generic, TypeVar

T = TypeVar('T')

class APIResponse(BaseModel, Generic[T]):
    success: bool = Field(True, description="Indicates if operation succeeded")
    message: Optional[str] = Field(None, description="Detailed explanation message")
    data: Optional[T] = Field(None, description="Actual data payload")

class ErrorResponse(BaseModel):
    success: bool = False
    message: str = Field(..., description="Failure description")
    errors: Optional[Any] = Field(None, description="Detailed stack/validation details")
