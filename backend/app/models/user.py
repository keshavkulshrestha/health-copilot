import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(50), nullable=True)
    blood_group = Column(String(10), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    preference = relationship("UserPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")
    documents = relationship("MedicalDocument", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("ChatConversation", back_populates="user", cascade="all, delete-orphan")

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    language = Column(String(10), default="en") # en or hi
    theme = Column(String(20), default="light") # light or dark
    summary_depth = Column(String(50), default="comprehensive") # simplified, comprehensive
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="preference")
