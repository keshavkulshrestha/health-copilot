from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from app.schemas.summary import SummaryResponse

class DocumentResponse(BaseModel):
    id: str
    user_id: str
    original_filename: str
    file_size: int
    file_type: str
    status: str
    error_message: Optional[str] = None
    page_count: int
    document_type: str
    created_at: datetime
    has_summary: bool = False
    summary: Optional[SummaryResponse] = None

    class Config:
        from_attributes = True

class DocumentStatusResponse(BaseModel):
    id: str
    status: str
    error_message: Optional[str] = None
    updated_at: datetime

class DocumentContentResponse(BaseModel):
    id: str
    original_filename: str
    extracted_text: Optional[str] = None
    page_count: int

class DocumentListResponse(BaseModel):
    items: List[DocumentResponse]
    total: int
    page: int
    limit: int
