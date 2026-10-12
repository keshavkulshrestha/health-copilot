import os
import uuid
import shutil
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from app.core.config import settings

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
ALLOWED_MIME_TYPES = {"application/pdf", "image/jpeg", "image/png", "image/jpg"}

class StorageService:
    def __init__(self, base_path: str = settings.STORAGE_PATH):
        self.base_path = Path(base_path).resolve()
        self.base_path.mkdir(parents=True, exist_ok=True)

    def validate_file(self, file: UploadFile) -> str:
        filename = file.filename or ""
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file format '{ext}'. Allowed formats: PDF, JPG, JPEG, PNG."
            )
        return ext

    def save_file(self, file: UploadFile, user_id: str) -> tuple[str, str, int]:
        ext = self.validate_file(file)
        
        # User-isolated folder
        user_dir = self.base_path / user_id
        user_dir.mkdir(parents=True, exist_ok=True)

        stored_filename = f"{uuid.uuid4().hex}{ext}"
        destination = user_dir / stored_filename

        # Write file with size limit enforcement
        max_bytes = settings.MAX_UPLOAD_MB * 1024 * 1024
        total_bytes = 0

        with open(destination, "wb") as buffer:
            while chunk := file.file.read(1024 * 64): # 64KB chunks
                total_bytes += len(chunk)
                if total_bytes > max_bytes:
                    buffer.close()
                    if destination.exists():
                        destination.unlink()
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_MB} MB."
                    )
                buffer.write(chunk)

        return str(destination), stored_filename, total_bytes

    def get_file_path(self, user_id: str, stored_filename: str) -> Path:
        # Prevent path traversal
        safe_filename = Path(stored_filename).name
        file_path = (self.base_path / user_id / safe_filename).resolve()
        
        # Verify path stays within base directory
        if not str(file_path).startswith(str(self.base_path)):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
        
        if not file_path.exists():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found.")
        
        return file_path

    def delete_file(self, user_id: str, stored_filename: str) -> bool:
        try:
            file_path = self.get_file_path(user_id, stored_filename)
            if file_path.exists():
                file_path.unlink()
            return True
        except Exception:
            return False

storage_service = StorageService()
