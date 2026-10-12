from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.models.document import MedicalDocument
from app.models.chat import ChatConversation, ChatMessage
from app.schemas.chat import (
    ConversationCreate,
    ConversationResponse,
    MessageCreate,
    MessageResponse
)
from app.api.deps import get_current_user
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/chat", tags=["AI Clinical Chatbot"])

@router.post("/conversations", response_model=ConversationResponse)
def create_conversation(
    conv_in: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate selected document ownership if supplied
    if conv_in.selected_document_id:
        doc = db.query(MedicalDocument).filter(
            MedicalDocument.id == conv_in.selected_document_id,
            MedicalDocument.user_id == current_user.id
        ).first()
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Selected document not found.")

    conversation = ChatConversation(
        user_id=current_user.id,
        title=conv_in.title or "New Health Consultation",
        selected_document_id=conv_in.selected_document_id
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    # Automatically add a warm greeting message
    user_lang = current_user.preference.language if current_user.preference else "en"
    if user_lang == "hi":
        greeting = "नमस्ते! मैं आपका MediMind स्वास्थ्य सहायक हूँ। मैं आपकी मेडिकल रिपोर्ट्स को समझने या स्वास्थ्य संबंधी सवालों के जवाब देने में मदद कर सकता हूँ। आप मुझसे क्या पूछना चाहते हैं?"
    else:
        greeting = "Hello! I am MediMind AI, your personal health assistant. I can help clarify your medical reports, laboratory test results, or answer health questions. How can I assist you today?"

    welcome_msg = ChatMessage(
        conversation_id=conversation.id,
        user_id=current_user.id,
        role="assistant",
        content=greeting,
        is_grounded=False
    )
    db.add(welcome_msg)
    db.commit()
    db.refresh(conversation)

    return conversation


@router.get("/conversations", response_model=List[ConversationResponse])
def list_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    convs = db.query(ChatConversation).filter(
        ChatConversation.user_id == current_user.id
    ).order_by(ChatConversation.updated_at.desc()).all()
    return convs


@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
def get_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = db.query(ChatConversation).filter(
        ChatConversation.id == conversation_id,
        ChatConversation.user_id == current_user.id
    ).first()

    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")

    return conv


@router.post("/conversations/{conversation_id}/messages", response_model=MessageResponse)
def send_message(
    conversation_id: str,
    msg_in: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = db.query(ChatConversation).filter(
        ChatConversation.id == conversation_id,
        ChatConversation.user_id == current_user.id
    ).first()

    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")

    # Save user message
    user_msg = ChatMessage(
        conversation_id=conv.id,
        user_id=current_user.id,
        role="user",
        content=msg_in.content.strip(),
        is_grounded=False
    )
    db.add(user_msg)
    db.commit()

    # Update conversation title from first question if default
    if conv.title in ("New Consultation", "New Health Consultation"):
        conv.title = msg_in.content[:45].strip() + ("..." if len(msg_in.content) > 45 else "")
        db.commit()

    # Gather document context if document attached
    doc_context = ""
    # Check if message specified documents or conversation has a selected doc
    doc_ids = msg_in.selected_document_ids or ([conv.selected_document_id] if conv.selected_document_id else [])
    
    if doc_ids:
        docs = db.query(MedicalDocument).filter(
            MedicalDocument.id.in_(doc_ids),
            MedicalDocument.user_id == current_user.id
        ).all()
        for d in docs:
            if d.extracted_text:
                doc_context += f"\n--- Report: {d.original_filename} ({d.document_type}) ---\n{d.extracted_text[:4000]}\n"

    # Assemble conversation history for context
    history_records = db.query(ChatMessage).filter(
        ChatMessage.conversation_id == conv.id
    ).order_by(ChatMessage.created_at.asc()).all()

    chat_history = [{"role": m.role, "content": m.content} for m in history_records]

    # Generate AI response
    lang = msg_in.language or (current_user.preference.language if current_user.preference else "en")
    ai_result = gemini_service.chat_response(
        messages=chat_history,
        document_context=doc_context if doc_context.strip() else None,
        language=lang
    )

    # Save assistant response
    assistant_msg = ChatMessage(
        conversation_id=conv.id,
        user_id=current_user.id,
        role="assistant",
        content=ai_result["content"],
        citations=ai_result.get("citations", []),
        is_grounded=ai_result.get("is_grounded", False)
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    return assistant_msg


@router.delete("/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = db.query(ChatConversation).filter(
        ChatConversation.id == conversation_id,
        ChatConversation.user_id == current_user.id
    ).first()

    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")

    db.delete(conv)
    db.commit()
    return {"message": "Conversation successfully deleted."}
