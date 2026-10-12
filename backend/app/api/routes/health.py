from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.core.config import settings
from app.services.gemini_service import gemini_service
import os

router = APIRouter(tags=["Health & Status"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0"
    }

@router.get("/ready")
def readiness_check(db: Session = Depends(get_db)):
    # 1. Check database connectivity
    db_ok = False
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception as e:
        db_ok = False

    # 2. Check storage directory
    storage_ok = os.path.isdir(settings.STORAGE_PATH) and os.access(settings.STORAGE_PATH, os.W_OK)

    # 3. Check AI configuration
    ai_configured = bool(settings.GEMINI_API_KEY)

    is_ready = db_ok and storage_ok
    if not is_ready:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "not_ready",
                "database": "connected" if db_ok else "unavailable",
                "storage": "writable" if storage_ok else "unwritable",
                "ai_configured": ai_configured
            }
        )

    return {
        "status": "ready",
        "database": "connected",
        "storage": "accessible",
        "ai_engine": "Gemini API" if ai_configured else "Clinical Heuristic Rules Engine (Add GEMINI_API_KEY for live Gemini)",
        "model": settings.GEMINI_MODEL
    }
