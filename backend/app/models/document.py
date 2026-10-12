import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class MedicalDocument(Base):
    __tablename__ = "medical_documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_size = Column(Integer, nullable=False) # bytes
    file_type = Column(String(50), nullable=False) # pdf, image/jpeg, etc
    status = Column(String(50), default="uploaded", index=True) # uploaded, processing, completed, failed
    error_message = Column(Text, nullable=True)
    extracted_text = Column(Text, nullable=True)
    page_count = Column(Integer, default=1)
    document_type = Column(String(100), default="General Medical Report")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="documents")
    summary = relationship("DocumentSummary", back_populates="document", uselist=False, cascade="all, delete-orphan")
