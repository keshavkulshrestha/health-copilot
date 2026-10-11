# Architecture

## MVP Features (5 max)
1. **Upload medical records** — Drag-and-drop UI with a prominent "Load Sample Lab Report" button to guarantee a flawless demo.
2. **AI extraction** — Parse typed PDFs/images to extract structured data (medicines, test values, diagnoses).
3. **AI summary & flags** — Generate plain-English explanations of abnormal values (e.g., "Hemoglobin is low, which may cause fatigue").
4. **Multi-language toggle** — Instant translation of AI summaries into Hindi (or regional language) for accessibility.
5. **Unified health timeline** — Chronological, visual view of all patient records and insights.

## Cut List (Do NOT build unless MVP is 100% done)
- Real OCR for messy, handwritten prescriptions (use the "Load Sample" hack for the demo).
- Real ABDM/ABHA integration (mock the ABHA ID badge only).
- Patient authentication/login flows.
- Medication refill reminders or push notifications.
- Direct doctor consultation booking.

## Data Model (ABDM/FHIR-inspired)
- `patients`: id, abha_id (mock), name, dob, gender, blood_group, created_at
- `health_records`: id, patient_id, record_type, file_name, extracted_data (JSONB for flexible FHIR-lite structure)
- `health_insights`: id, record_id, summary_en, summary_regional, abnormal_flags (JSONB), disclaimer_acknowledged

## Top 3 Risks & Mitigations
1. **OCR fails on real prescriptions during demo** → Mitigated by the "Load Sample" button that injects pre-verified JSON.
2. **AI hallucinates medical data** → Mitigated by strict JSON schema output, rule-based fallback, and a prominent, persistent medical disclaimer in the UI.
3. **Gemini API rate limits during judge testing** → Mitigated by caching insights and falling back to rule-based summaries if the API returns a 429 error.
