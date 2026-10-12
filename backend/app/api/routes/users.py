from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, UserPreference
from app.schemas.auth import UserResponse, UserUpdate, PreferenceUpdate, UserPreferenceResponse
from app.api.deps import get_current_user
from app.services.storage_service import storage_service

router = APIRouter(prefix="/users", tags=["User Profile & Preferences"])

@router.patch("/me", response_model=UserResponse)
def update_profile(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
    if user_in.age is not None:
        current_user.age = user_in.age
    if user_in.gender is not None:
        current_user.gender = user_in.gender
    if user_in.blood_group is not None:
        current_user.blood_group = user_in.blood_group

    db.commit()
    db.refresh(current_user)
    return current_user

@router.patch("/me/preferences", response_model=UserPreferenceResponse)
def update_preferences(
    pref_in: PreferenceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pref = db.query(UserPreference).filter(UserPreference.user_id == current_user.id).first()
    if not pref:
        pref = UserPreference(user_id=current_user.id)
        db.add(pref)

    if pref_in.language is not None:
        pref.language = pref_in.language
    if pref_in.theme is not None:
        pref.theme = pref_in.theme
    if pref_in.summary_depth is not None:
        pref.summary_depth = pref_in.summary_depth

    db.commit()
    db.refresh(pref)
    return pref

@router.delete("/me")
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Clean up files stored on disk
    for doc in current_user.documents:
        storage_service.delete_file(current_user.id, doc.stored_filename)

    db.delete(current_user)
    db.commit()
    return {"message": "Account and all associated health documents successfully deleted."}
