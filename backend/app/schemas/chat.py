from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class CitationRef(BaseModel):
    quote: str
    document_id: Optional[str] = None
    document_name: Optional[str] = None
    page_number: Optional[int] = 1

class MessageCreate(BaseModel):
    content: str
    language: Optional[str] = "en" # 'en' or 'hi'
    selected_document_ids: Optional[List[str]] = []

class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    citations: List[CitationRef] = []
    is_grounded: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    title: Optional[str] = "New Consultation"
    selected_document_id: Optional[str] = None

class ConversationResponse(BaseModel):
    id: str
    title: str
    selected_document_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True
