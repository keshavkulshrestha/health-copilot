import os
from pathlib import Path
from typing import Tuple, List, Dict
import pypdf
from PIL import Image

class DocumentProcessor:
    @staticmethod
    def extract_text_from_pdf(file_path: str) -> Tuple[str, int, List[Dict[str, any]]]:
        """Extract text from PDF with per-page tracking."""
        extracted_text = []
        pages_data = []
        
        with open(file_path, "rb") as f:
            reader = pypdf.PdfReader(f)
            num_pages = len(reader.pages)
            
            for idx, page in enumerate(reader.pages):
                page_num = idx + 1
                text = page.extract_text() or ""
                cleaned_text = text.strip()
                if cleaned_text:
                    extracted_text.append(f"--- Page {page_num} ---\n{cleaned_text}")
                    pages_data.append({"page": page_num, "text": cleaned_text})

        combined_text = "\n\n".join(extracted_text)
        return combined_text, num_pages, pages_data

    @staticmethod
    def extract_text_from_image(file_path: str) -> Tuple[str, int, List[Dict[str, any]]]:
        """Process image document."""
        # Validate that it is a valid image
        try:
            with Image.open(file_path) as img:
                width, height = img.size
                format_name = img.format
                # Attempt OCR or provide structured info
                text = f"[Medical Image Document: {format_name}, Resolution: {width}x{height}]"
        except Exception as e:
            text = f"[Image processing notice: {str(e)}]"
            
        return text, 1, [{"page": 1, "text": text}]

    @classmethod
    def process_file(cls, file_path: str) -> Tuple[str, int, str]:
        """
        Process any supported document file.
        Returns: (extracted_text, page_count, detected_document_type)
        """
        ext = Path(file_path).suffix.lower()
        if ext == ".pdf":
            text, pages, _ = cls.extract_text_from_pdf(file_path)
        else:
            text, pages, _ = cls.extract_text_from_image(file_path)

        # Detect document type heuristically
        lower_text = text.lower()
        if any(w in lower_text for w in ["hemoglobin", "wbc", "rbc", "platelet", "glucose", "cholesterol", "lipid", "cbc", "creatinine", "pathology", "laboratory"]):
            doc_type = "Complete Blood Count / Lab Report"
        elif any(w in lower_text for w in ["rx", "prescription", "mg", "tablet", "dosage", "capsule", "syrup"]):
            doc_type = "Prescription"
        elif any(w in lower_text for w in ["discharge", "admission", "hospital", "diagnosis", "surgery"]):
            doc_type = "Discharge Summary"
        elif any(w in lower_text for w in ["x-ray", "mri", "ct scan", "ultrasound", "radiology"]):
            doc_type = "Radiology Report"
        else:
            doc_type = "General Medical Consultation"

        return text, pages, doc_type

document_processor = DocumentProcessor()
