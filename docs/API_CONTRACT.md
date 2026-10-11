# API Contract (Source of Truth)

This document defines the exact request and response shapes for all API endpoints. Do not modify this without A's approval.

| Endpoint | Request | Success Response | Errors |
| :--- | :--- | :--- | :--- |
| `GET /api/patient` | None | `200 { patient: Patient }` | `500 SERVER` |
| `GET /api/records` | None | `200 { records: HealthRecord[] }` | `500 SERVER` |
| `GET /api/records/{id}` | None | `200 { record: HealthRecord, insight: HealthInsight \| null }` | `404 NOT_FOUND` |
| `POST /api/analyze` | `{ recordData: ExtractedData }` | `200 { insight: HealthInsight, source: 'ai' \| 'rules' }` | *Never fails: falls back to rules* |

## Type Definitions

See `lib/types.ts` for the exact TypeScript interfaces.

## Error Format

All errors use this shape:
```json
{
  "error": {
    "code": "VALIDATION" | "NOT_FOUND" | "FORBIDDEN" | "SERVER",
    "message": "Human-readable error message"
  }
}
```
