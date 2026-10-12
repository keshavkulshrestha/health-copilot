import os
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.user import User, UserPreference
from app.models.document import MedicalDocument
from app.models.summary import DocumentSummary
from app.models.chat import ChatConversation, ChatMessage
from app.services.storage_service import storage_service

def seed():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        email = "patient@medimind.ai"
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(
                email=email,
                hashed_password=get_password_hash("Password123!"),
                full_name="Alex Mercer",
                age=34,
                gender="Male",
                blood_group="O+"
            )
            db.add(user)
            db.flush()

            pref = UserPreference(user_id=user.id, language="en", theme="light")
            db.add(pref)

            # Sample Lab Report
            sample_content = (
                "METROPOLIS CLINICAL LABORATORIES\n"
                "Patient: Alex Mercer | Age: 34 | Gender: Male\n"
                "Referred By: Dr. R. K. Singhal, MD\n"
                "Test Date: 2026-10-10\n\n"
                "COMPLETE BLOOD COUNT (CBC):\n"
                "Hemoglobin: 10.2 g/dL (Low, Ref: 13.0 - 17.0)\n"
                "Total Leukocyte Count (WBC): 7400 /cumm (Normal, Ref: 4000 - 11000)\n"
                "Platelet Count: 2.4 lakhs/cumm (Normal, Ref: 1.5 - 4.5)\n"
                "Fasting Blood Sugar: 92 mg/dL (Normal, Ref: 70 - 100)\n"
                "HbA1c: 5.4 % (Normal, Ref: 4.0 - 5.6)\n"
                "Serum Creatinine: 0.9 mg/dL (Normal, Ref: 0.7 - 1.3)\n"
                "Total Cholesterol: 215 mg/dL (High, Ref: < 200)\n\n"
                "CLINICAL IMPRESSION & RECOMMENDATIONS:\n"
                "1. Mild microcytic hypochromic anemia (Hemoglobin 10.2 g/dL).\n"
                "2. Borderline hypercholesterolemia (Total Cholesterol 215 mg/dL).\n"
                "3. Recommend dietary consultation, reduction of dietary saturated fats, and iron supplementation review with primary care physician."
            )

            # Write mock file
            user_dir = storage_service.base_path / user.id
            user_dir.mkdir(parents=True, exist_ok=True)
            stored_file = "sample_complete_blood_count.pdf"
            file_path = user_dir / stored_file
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(sample_content)

            doc = MedicalDocument(
                user_id=user.id,
                original_filename="Complete_Blood_Count_Report.pdf",
                stored_filename=stored_file,
                file_path=str(file_path),
                file_size=len(sample_content.encode("utf-8")),
                file_type="application/pdf",
                status="completed",
                extracted_text=sample_content,
                page_count=1,
                document_type="Complete Blood Count / Lab Report"
            )
            db.add(doc)
            db.flush()

            # Structured Summary
            summary = DocumentSummary(
                document_id=doc.id,
                user_id=user.id,
                quick_summary="Your complete blood count indicates mild anemia (Hemoglobin 10.2 g/dL) and slightly elevated total cholesterol (215 mg/dL). Kidney function and glycemic indicators are within normal reference ranges.",
                key_findings=[
                    "Hemoglobin is low at 10.2 g/dL (normal range: 13.0 - 17.0 g/dL), which can contribute to generalized tiredness or reduced stamina.",
                    "Total Cholesterol is mildly elevated at 215 mg/dL (desirable: < 200 mg/dL).",
                    "Fasting glucose (92 mg/dL) and HbA1c (5.4%) reflect healthy blood sugar regulation.",
                    "Renal function is optimal with Serum Creatinine at 0.9 mg/dL."
                ],
                lab_values=[
                    {"name": "Hemoglobin", "value": "10.2", "unit": "g/dL", "reference_range": "13.0 - 17.0", "status": "low"},
                    {"name": "Total Leukocyte Count (WBC)", "value": "7400", "unit": "/cumm", "reference_range": "4000 - 11000", "status": "normal"},
                    {"name": "Platelet Count", "value": "2.4", "unit": "lakhs/cumm", "reference_range": "1.5 - 4.5", "status": "normal"},
                    {"name": "Fasting Blood Sugar", "value": "92", "unit": "mg/dL", "reference_range": "70 - 100", "status": "normal"},
                    {"name": "HbA1c", "value": "5.4", "unit": "%", "reference_range": "4.0 - 5.6", "status": "normal"},
                    {"name": "Serum Creatinine", "value": "0.9", "unit": "mg/dL", "reference_range": "0.7 - 1.3", "status": "normal"},
                    {"name": "Total Cholesterol", "value": "215", "unit": "mg/dL", "reference_range": "< 200", "status": "high"}
                ],
                recommendations=[
                    "Review iron supplementation options with your attending physician.",
                    "Incorporate heart-healthy dietary habits: increase soluble fiber, oats, and legumes.",
                    "Maintain active hydration and routine physical exercise (150 min/week)."
                ],
                questions_for_doctor=[
                    "Should we test serum ferritin and transferrin saturation to evaluate iron stores?",
                    "Do you recommend starting lipid-lowering lifestyle therapy or re-checking in 3 months?",
                    "What target hemoglobin level should we aim for over the next 8 weeks?"
                ],
                citations=[
                    {"quote": "Hemoglobin: 10.2 g/dL (Low, Ref: 13.0 - 17.0)", "page_number": 1},
                    {"quote": "Total Cholesterol: 215 mg/dL (High, Ref: < 200)", "page_number": 1}
                ],
                disclaimer="This summary is generated by MediMind AI for informational purposes only. It is not medical advice, diagnosis, or treatment. Consult a licensed healthcare professional for medical decisions.",
                language="en",
                is_ai_generated=True
            )
            db.add(summary)

            # Sample Consultation
            conv = ChatConversation(
                user_id=user.id,
                title="CBC Anemia & Lipid Consultation",
                selected_document_id=doc.id
            )
            db.add(conv)
            db.flush()

            msg1 = ChatMessage(
                conversation_id=conv.id,
                user_id=user.id,
                role="assistant",
                content="Hello Alex! I am MediMind AI. I have reviewed your Complete Blood Count report. Feel free to ask questions about your hemoglobin or cholesterol levels.",
                is_grounded=False
            )
            msg2 = ChatMessage(
                conversation_id=conv.id,
                user_id=user.id,
                role="user",
                content="Why is my hemoglobin low and what should I eat?",
                is_grounded=False
            )
            msg3 = ChatMessage(
                conversation_id=conv.id,
                user_id=user.id,
                role="assistant",
                content="Based on your report, your hemoglobin is measured at **10.2 g/dL**, which is below the standard male reference range of **13.0 - 17.0 g/dL**. This mild reduction can occasionally cause mild fatigue or feeling cold.\n\n### Dietary Recommendations:\n- **Iron-Rich Foods:** Spinach, lentils, chickpeas, tofu, lean meats, and fortified cereals.\n- **Vitamin C Pairing:** Pair iron sources with citrus fruits, tomatoes, or bell peppers to enhance absorption.\n- **Consultation Tip:** Please consult your primary care doctor before starting iron supplements, so they can assess your ferritin levels.",
                citations=[{"quote": "Hemoglobin: 10.2 g/dL (Low, Ref: 13.0 - 17.0)", "document_name": "Complete_Blood_Count_Report.pdf", "page_number": 1}],
                is_grounded=True
            )
            db.add_all([msg1, msg2, msg3])

            db.commit()
            print("Successfully seeded demo user: patient@medimind.ai (Password: Password123!)")
        else:
            print("Demo user already exists.")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
