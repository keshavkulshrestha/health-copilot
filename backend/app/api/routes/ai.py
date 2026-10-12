from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.models.document import MedicalDocument
from app.models.summary import DocumentSummary
from app.schemas.summary import SummaryResponse, SummarizeRequest
from app.api.deps import get_current_user
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/ai", tags=["AI Medical Intelligence"])

@router.post("/documents/{document_id}/summarize", response_model=SummaryResponse)
def generate_summary(
    document_id: str,
    payload: SummarizeRequest = SummarizeRequest(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(MedicalDocument).filter(
        MedicalDocument.id == document_id,
        MedicalDocument.user_id == current_user.id
    ).first()

    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")

    if not doc.extracted_text or not doc.extracted_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document text is not yet extracted or empty. Please wait for processing."
        )

    lang = payload.language or "en"
    
    # Check if summary already exists
    existing = db.query(DocumentSummary).filter(
        DocumentSummary.document_id == document_id
    ).first()

    if existing and not payload.force_refresh and existing.language == lang:
        return existing

    # Generate summary with Gemini
    summary_data = gemini_service.generate_document_summary(doc.extracted_text, language=lang)

    if existing:
        existing.quick_summary = summary_data.get("quick_summary", "")
        existing.key_findings = summary_data.get("key_findings", [])
        existing.lab_values = summary_data.get("lab_values", [])
        existing.recommendations = summary_data.get("recommendations", [])
        existing.questions_for_doctor = summary_data.get("questions_for_doctor", [])
        existing.citations = summary_data.get("citations", [])
        existing.disclaimer = summary_data.get("disclaimer", "")
        existing.language = lang
        existing.is_ai_generated = summary_data.get("is_ai_generated", True)
        db.commit()
        db.refresh(existing)
        return existing

    new_summary = DocumentSummary(
        document_id=doc.id,
        user_id=current_user.id,
        quick_summary=summary_data.get("quick_summary", ""),
        key_findings=summary_data.get("key_findings", []),
        lab_values=summary_data.get("lab_values", []),
        recommendations=summary_data.get("recommendations", []),
        questions_for_doctor=summary_data.get("questions_for_doctor", []),
        citations=summary_data.get("citations", []),
        disclaimer=summary_data.get("disclaimer", ""),
        language=lang,
        is_ai_generated=summary_data.get("is_ai_generated", True)
    )
    db.add(new_summary)
    db.commit()
    db.refresh(new_summary)
    return new_summary


@router.get("/documents/{document_id}/summary", response_model=SummaryResponse)
def get_document_summary(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(MedicalDocument).filter(
        MedicalDocument.id == document_id,
        MedicalDocument.user_id == current_user.id
    ).first()

    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")

    summary = db.query(DocumentSummary).filter(
        DocumentSummary.document_id == document_id
    ).first()

    if not summary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Summary has not yet been generated for this document."
        )

    return summary
