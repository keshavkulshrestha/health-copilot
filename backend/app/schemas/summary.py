from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class LabValueItem(BaseModel):
    name: str
    value: str
    unit: Optional[str] = None
    reference_range: Optional[str] = None
    status: Optional[str] = "normal" # normal, low, high, critical, unknown

class CitationItem(BaseModel):
    quote: str
    page_number: Optional[int] = 1

class SummaryResponse(BaseModel):
    id: str
    document_id: str
    quick_summary: str
    key_findings: List[str] = []
    lab_values: List[LabValueItem] = []
    recommendations: List[str] = []
    questions_for_doctor: List[str] = []
    citations: List[CitationItem] = []
    disclaimer: str
    language: str
    is_ai_generated: bool
    created_at: datetime

    class Config:
        from_attributes = True

class SummarizeRequest(BaseModel):
    language: Optional[str] = "en" # 'en' or 'hi'
    force_refresh: Optional[bool] = False
