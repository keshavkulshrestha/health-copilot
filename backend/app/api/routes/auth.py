from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User, UserPreference
from app.schemas.auth import UserRegister, UserLogin, UserResponse, TokenResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Hash password
    hashed_pw = get_password_hash(user_in.password)
    user = User(
        email=user_in.email.lower(),
        hashed_password=hashed_pw,
        full_name=user_in.full_name,
        age=user_in.age,
        gender=user_in.gender,
        blood_group=user_in.blood_group
    )
    db.add(user)
    db.flush()

    # Create default user preference
    pref = UserPreference(user_id=user.id, language="en", theme="light")
    db.add(pref)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id)
    return TokenResponse(access_token=token, token_type="bearer", user=user)

@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email.lower()).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user account.")

    token = create_access_token(subject=user.id)
    return TokenResponse(access_token=token, token_type="bearer", user=user)

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out."}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
