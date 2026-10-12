import os
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, BackgroundTasks, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

from app.core.database import get_db, SessionLocal
from app.models.user import User
from app.models.document import MedicalDocument
from app.models.summary import DocumentSummary
from app.schemas.document import (
    DocumentResponse,
    DocumentStatusResponse,
    DocumentContentResponse,
    DocumentListResponse
)
from app.api.deps import get_current_user
from app.services.storage_service import storage_service
from app.services.document_processor import document_processor
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/documents", tags=["Medical Documents"])

def run_background_document_processing(document_id: str):
    """Background task to extract text, determine type, and generate AI summary."""
    db: Session = SessionLocal()
    try:
        doc = db.query(MedicalDocument).filter(MedicalDocument.id == document_id).first()
        if not doc:
            return

        doc.status = "processing"
        db.commit()

        # Step 1: Text extraction
        extracted_text, page_count, doc_type = document_processor.process_file(doc.file_path)
        doc.extracted_text = extracted_text
        doc.page_count = page_count
        doc.document_type = doc_type

        # Step 2: AI Summarization using user preference
        user = db.query(User).filter(User.id == doc.user_id).first()
        user_lang = user.preference.language if (user and user.preference) else "en"

        summary_data = gemini_service.generate_document_summary(extracted_text, language=user_lang)

        # Check existing summary
        existing_sum = db.query(DocumentSummary).filter(DocumentSummary.document_id == doc.id).first()
        if existing_sum:
            db.delete(existing_sum)

        summary_obj = DocumentSummary(
            document_id=doc.id,
            user_id=doc.user_id,
            quick_summary=summary_data.get("quick_summary", ""),
            key_findings=summary_data.get("key_findings", []),
            lab_values=summary_data.get("lab_values", []),
            recommendations=summary_data.get("recommendations", []),
            questions_for_doctor=summary_data.get("questions_for_doctor", []),
            citations=summary_data.get("citations", []),
            disclaimer=summary_data.get("disclaimer", ""),
            language=user_lang,
            is_ai_generated=summary_data.get("is_ai_generated", True)
        )
        db.add(summary_obj)

        doc.status = "completed"
        doc.error_message = None
        db.commit()

    except Exception as e:
        db.rollback()
        try:
            doc = db.query(MedicalDocument).filter(MedicalDocument.id == document_id).first()
            if doc:
                doc.status = "failed"
                doc.error_message = f"Processing error: {str(e)}"
                db.commit()
        except Exception:
            pass
    finally:
        db.close()


@router.post("/upload", response_model=DocumentResponse)
def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Save file privately
    dest_path, stored_filename, file_size = storage_service.save_file(file, current_user.id)

    # Create document record
    doc = MedicalDocument(
        user_id=current_user.id,
        original_filename=file.filename or "medical_document",
        stored_filename=stored_filename,
        file_path=dest_path,
        file_size=file_size,
        file_type=file.content_type or "application/octet-stream",
        status="uploaded"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # Trigger background processing
    background_tasks.add_task(run_background_document_processing, doc.id)

    return doc


@router.get("", response_model=DocumentListResponse)
def list_documents(
    search: Optional[str] = Query(None, description="Search by filename or extracted content"),
    status: Optional[str] = Query(None, description="Filter by status: uploaded, processing, completed, failed"),
    document_type: Optional[str] = Query(None, description="Filter by document type"),
    sort_by: Optional[str] = Query("created_at", description="created_at, original_filename, file_size"),
    order: Optional[str] = Query("desc", description="asc or desc"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(MedicalDocument).filter(MedicalDocument.user_id == current_user.id)

    if status:
        query = query.filter(MedicalDocument.status == status)

    if document_type:
        query = query.filter(MedicalDocument.document_type == document_type)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                MedicalDocument.original_filename.ilike(search_filter),
                MedicalDocument.document_type.ilike(search_filter),
                MedicalDocument.extracted_text.ilike(search_filter)
            )
        )

    # Sorting
    sort_col = getattr(MedicalDocument, sort_by, MedicalDocument.created_at)
    if order.lower() == "asc":
        query = query.order_by(asc(sort_col))
    else:
        query = query.order_by(desc(sort_col))

    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()

    # Annotate summary existence
    res_items = []
    for item in items:
        resp = DocumentResponse.model_validate(item)
        resp.has_summary = item.summary is not None
        res_items.append(resp)

    return DocumentListResponse(
        items=res_items,
        total=total,
        page=page,
        limit=limit
    )


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
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

    resp = DocumentResponse.model_validate(doc)
    resp.has_summary = doc.summary is not None
    return resp


@router.get("/{document_id}/status", response_model=DocumentStatusResponse)
def get_document_status(
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

    return DocumentStatusResponse(
        id=doc.id,
        status=doc.status,
        error_message=doc.error_message,
        updated_at=doc.updated_at
    )


@router.get("/{document_id}/content", response_model=DocumentContentResponse)
def get_document_content(
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

    return DocumentContentResponse(
        id=doc.id,
        original_filename=doc.original_filename,
        extracted_text=doc.extracted_text,
        page_count=doc.page_count
    )


@router.get("/{document_id}/download")
def download_document(
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

    file_path = storage_service.get_file_path(current_user.id, doc.stored_filename)
    return FileResponse(
        path=file_path,
        filename=doc.original_filename,
        media_type=doc.file_type
    )


@router.delete("/{document_id}")
def delete_document(
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

    # Remove file from disk
    storage_service.delete_file(current_user.id, doc.stored_filename)

    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully."}


@router.post("/{document_id}/retry", response_model=DocumentStatusResponse)
def retry_document_processing(
    document_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(MedicalDocument).filter(
        MedicalDocument.id == document_id,
        MedicalDocument.user_id == current_user.id
    ).first()

    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")

    doc.status = "uploaded"
    doc.error_message = None
    db.commit()

    background_tasks.add_task(run_background_document_processing, doc.id)

    return DocumentStatusResponse(
        id=doc.id,
        status="uploaded",
        error_message=None,
        updated_at=doc.updated_at
    )
