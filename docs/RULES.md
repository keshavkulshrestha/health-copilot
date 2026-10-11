# Hackathon Rules & Guidelines

## Problem Statement
Altrix Labs — AI-Powered Personal Health Copilot
Design and develop an AI-powered Personal Health Copilot that helps individuals understand, organize, and manage their healthcare journey through intelligent analysis of medical records, prescriptions, diagnostic reports, and wellness data.

## One-Sentence Problem
Healthcare data is fragmented across prescriptions, lab reports, and discharge summaries, making it difficult for patients to understand and manage their health effectively.

## Target User
Patients managing their own health journey, and potentially caregivers assisting them.

## Judging Criteria (100 points)
- **AI Utilization (35%)**: Accuracy of OCR/extraction (medicines, test values, dates); quality of plain-language summaries and explanations of abnormal values.
- **Technical Architecture (25%)**: Clean data pipeline, sensible storage, structured data model, ABDM-ready (FHIR-style) schema.
- **User Experience (20%)**: Easy upload flow, readable summaries, clear health timeline.
- **Healthcare Impact (10%)**: Medical correctness, safe wording, no misleading claims, appropriate disclaimers.
- **Presentation & Demo (10%)**: Working prototype demonstrated clearly through a short demo or a few slides.

## Bonus Credit (5-10 points)
- **Multi-language support**: Regional-language summaries and OCR for bilingual prescriptions.
- **ABDM/ABHA readiness**: FHIR-style records and a mock ABHA link or import.

## Submission Requirements
- GitHub repository link
- Deployed live URL
- [VERIFY: public or private repo?]
- [VERIFY: deadline and timezone]
- [VERIFY: AI tool disclosure required?]

## Stack Decision
Next.js (App Router, TypeScript) + Tailwind + Supabase + Vercel + Google Gemini API

## Team Roles
- **A (Lead)**: Foundation, API, AI integration, database schema, deployment.
- **B (Intermediate)**: Upload flow, timeline UI, data pipeline, API endpoints for records.
- **C (Beginner)**: Dashboard UI, record detail view, multi-language toggle, README.

## Core Workflow (5 steps)
1. Patient uploads a medical record (or clicks "Load Sample" for the demo).
2. System extracts structured data (medicines, test values, diagnoses).
3. AI generates a plain-English summary + abnormal value explanations.
4. Patient toggles to Hindi/regional language to verify accessibility.
5. Record appears on the unified health timeline with an ABHA-ready data model.
