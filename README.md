# MediMind AI — Your Personal Health Assistant

MediMind AI is a comprehensive full-stack healthcare web application combining **React, TypeScript, and Tailwind CSS** on the frontend with a **Python FastAPI** backend powered by **Google Gemini** AI and document processing pipelines (PDF & OCR extraction).

---

## 1. System Architecture

```
┌───────────────────────────────────────────────────────────┐
│              MediMind AI Frontend (React + Vite)           │
│  - TypeScript, Tailwind CSS, Lucide Icons, React Router   │
│  - Dark / Light Theme Persistence                         │
│  - Bilingual English (EN) & Hindi (हिंदी) Localization     │
└────────────────────────────┬──────────────────────────────┘
                             │ REST / JSON (JWT Auth)
┌────────────────────────────▼──────────────────────────────┐
│                  FastAPI Backend Server                   │
│  - JWT Bearer Authentication & Strict User Isolation     │
│  - Pydantic v2 Request/Response Validation                │
│  - SQLAlchemy 2.0 ORM (SQLite / PostgreSQL)              │
│  - Async Background Task Queue for Document Analysis      │
└──────────────┬─────────────────────────────┬──────────────┘
               │                             │
┌──────────────▼─────────────┐ ┌─────────────▼──────────────┐
│  Private Document Storage  │ │   Gemini AI & Document     │
│  & Text Extraction         │ │   Intelligence Engine      │
│  - Isolated folder per user│ │  - Google Gen AI SDK       │
│  - PyMuPDF / pypdf         │ │  - Gemini 2.5 Flash        │
│  - Path Traversal Guard    │ │  - Plain-Language Summary  │
│  - Size Limit: 25 MB       │ │  - Lab Biomarker Schema    │
│  - Pillow format validator │ │  - Grounded Chat Assistant │
└────────────────────────────┘ └────────────────────────────┘
```

---

## 2. Key Features

- **Personalized Patient Dashboard**:
  - Live metric counters for total uploaded reports, flagged biomarkers, pending processing jobs, and active consultations.
  - Recent reports feed with real-time status pills (`uploaded`, `processing`, `completed`, `failed`).
  - Urgent medical notice and 24/7 emergency service disclaimer.
  - Call-to-action empty states for new patients.

- **Private Medical Document Upload**:
  - Drag-and-drop file uploader supporting PDF, JPG, JPEG, and PNG files up to 25 MB.
  - Background extraction pipeline (validation → text parsing → Gemini analysis).
  - Processing status tracking with auto-polling and retry capabilities.

- **Document Library**:
  - Multi-criteria filtering by category (Lab Reports, Prescriptions, Discharge Summaries, Radiology) and status.
  - Dynamic text search through report names and extracted content.
  - Sorting by date, name, and size.
  - Secure in-browser content preview and authorized file download.
  - Protected deletion flow with double confirmation.

- **AI Medical Document Summaries**:
  - Executive patient-friendly overview written in simple language.
  - Structured Biomarker / Lab Values Table displaying measured values, units, normal reference ranges, and status badges (Normal, Low, High, Critical).
  - Key findings list and clinical recommendations.
  - Prepared questions to ask your doctor with one-click copy buttons.
  - Direct citations grounded in the source document.
  - Instant translation toggle between English and Hindi.

- **AI Clinical Health Chatbot**:
  - Multi-turn conversation history with persistent sessions.
  - Document attachment selector to ground answers in any uploaded report.
  - Citation tags showing exact report quotes and page references.
  - Bilingual support (English and Hindi).
  - Red-flag symptom detection advising emergency care.

- **Settings & Profile**:
  - Patient demographic management (Full Name, Age, Gender, Blood Group).
  - Preferences for default language and theme.
  - Account deletion with cascading file and record cleanup.

---

## 3. Directory Layout

```
kashigha/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── health.py       # Health & readiness probes
│   │   │   │   ├── auth.py         # Login, register, logout, me
│   │   │   │   ├── users.py        # Profile & preference management
│   │   │   │   ├── documents.py    # Upload, list, download, retry, delete
│   │   │   │   ├── ai.py           # Gemini summarization endpoints
│   │   │   │   └── chat.py         # Multi-turn chat & document grounding
│   │   │   └── deps.py             # Auth dependencies & token verification
│   │   ├── core/
│   │   │   ├── config.py           # Pydantic settings from .env
│   │   │   ├── database.py         # SQLAlchemy engine & session factory
│   │   │   └── security.py         # bcrypt hashing & JWT utilities
│   │   ├── models/                 # User, Document, Summary, Chat models
│   │   ├── schemas/                # Pydantic schemas
│   │   ├── services/
│   │   │   ├── storage_service.py  # Sandboxed private file management
│   │   │   ├── document_processor.py # PDF/Image extraction & classification
│   │   │   └── gemini_service.py   # Gemini API integration & fallbacks
│   │   ├── scripts/
│   │   │   └── seed_sample.py      # Seed demo patient data
│   │   └── main.py                 # FastAPI application root & CORS
│   ├── tests/                      # Pytest unit & integration tests
│   ├── requirements.txt            # Python dependencies
│   ├── pytest.ini                  # Pytest configuration
│   ├── .env.example                # Environment variables template
│   └── Dockerfile                  # Backend container configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/             # Navbar, Sidebar, Layout shell
│   │   │   └── ui/                 # Badge, Modal dialog
│   │   ├── context/
│   │   │   ├── AuthContext.tsx     # Session state & token storage
│   │   │   ├── ThemeContext.tsx    # Light / Dark theme persistence
│   │   │   └── LanguageContext.tsx # Bilingual EN / HI translation system
│   │   ├── lib/
│   │   │   └── api.ts              # Typed API client
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx   # Overview & statistics
│   │   │   ├── UploadPage.tsx      # Drag-and-drop & pipeline tracker
│   │   │   ├── DocumentsPage.tsx   # Searchable records library
│   │   │   ├── SummaryPage.tsx     # Structured clinical report breakdown
│   │   │   ├── ChatPage.tsx        # Context-grounded health assistant
│   │   │   ├── SettingsPage.tsx    # Preferences & account deletion
│   │   │   ├── LoginPage.tsx       # Authentication
│   │   │   └── RegisterPage.tsx    # Demographic intake
│   │   ├── types/                  # Domain TypeScript interfaces
│   │   ├── App.tsx                 # Protected route navigation
│   │   ├── main.tsx                # React DOM root
│   │   └── index.css               # Tailwind CSS & design tokens
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── docker-compose.yml              # Multi-container local dev orchestration
└── README.md
```

---

## 4. Setup & Running Locally

### Prerequisites
- Python 3.10+ (Python 3.11 / 3.14 tested)
- Node.js 18+ and npm

### Backend Setup
1. Open a terminal in `backend/`:
   ```bash
   cd backend
   python -m venv venv
   # On Windows:
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure environment:
   ```bash
   copy .env.example .env
   ```
   Add your Google Gemini API key if available:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   DATABASE_URL=sqlite:///./medimind.db
   SECRET_KEY=your_jwt_secret_key_minimum_32_characters
   FRONTEND_ORIGIN=http://localhost:5173
   STORAGE_PATH=./storage/documents
   MAX_UPLOAD_MB=25
   ```
   *(Note: If `GEMINI_API_KEY` is omitted, the application seamlessly runs on its built-in clinical rule engine with full support for all features).*

4. Seed the demo account (optional):
   ```bash
   python -m app.scripts.seed_sample
   ```
   Demo account credentials:
   - **Email:** `patient@medimind.ai`
   - **Password:** `Password123!`

5. Start the backend:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   Interactive Swagger docs are live at: **[http://127.0.0.1:8000/api/docs](http://127.0.0.1:8000/api/docs)**

### Frontend Setup
1. Open a second terminal in `frontend/`:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 5. Automated Tests

Run the backend test suite:
```bash
cd backend
.\venv\Scripts\python.exe -m pytest -v
```

**Results:**
```
tests/test_ai_and_chat.py::test_ai_summary_and_chat PASSED
tests/test_auth.py::test_register_and_login_flow PASSED
tests/test_documents.py::test_document_lifecycle_and_user_isolation PASSED
tests/test_health.py::test_health_endpoint PASSED
tests/test_health.py::test_readiness_endpoint PASSED
======================== 5 passed in 2.60s ========================
```

Frontend build check:
```bash
cd frontend
npm run build
```
Builds cleanly with zero TypeScript errors or unresolved imports.

---

## 6. Docker Deployment

To launch the complete full-stack environment with Docker Compose:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API Docs: `http://localhost:8000/api/docs`
