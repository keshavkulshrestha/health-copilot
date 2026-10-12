import io
from app.models.document import MedicalDocument

def test_document_lifecycle_and_user_isolation(client, auth_headers):
    # 1. Upload sample text-based PDF or medical note
    dummy_pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 55\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Hemoglobin: 10.5 g/dL WBC: 6500) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000214 00000 n\ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n320\n%%EOF"

    upload_res = client.post(
        "/api/documents/upload",
        files={"file": ("lab_report.pdf", dummy_pdf_content, "application/pdf")},
        headers=auth_headers
    )
    assert upload_res.status_code == 200
    doc_data = upload_res.json()
    doc_id = doc_data["id"]
    assert doc_data["original_filename"] == "lab_report.pdf"
    assert doc_data["status"] in ("uploaded", "processing", "completed")

    # 2. List documents
    list_res = client.get("/api/documents", headers=auth_headers)
    assert list_res.status_code == 200
    assert list_res.json()["total"] >= 1
    assert list_res.json()["items"][0]["id"] == doc_id

    # 3. Get document details
    get_res = client.get(f"/api/documents/{doc_id}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == doc_id

    # 4. Check status endpoint
    status_res = client.get(f"/api/documents/{doc_id}/status", headers=auth_headers)
    assert status_res.status_code == 200
    assert "status" in status_res.json()

    # 5. User isolation test: Register a second user
    res2 = client.post(
        "/api/auth/register",
        json={"email": "second_user@example.com", "password": "Password123!"}
    )
    token2 = res2.json()["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}

    # User 2 shouldn't see user 1's documents in their list
    user2_list = client.get("/api/documents", headers=headers2)
    assert user2_list.status_code == 200
    assert user2_list.json()["total"] == 0

    # User 2 cannot access user 1's document
    user2_get = client.get(f"/api/documents/{doc_id}", headers=headers2)
    assert user2_get.status_code == 404

    # User 2 cannot delete user 1's document
    user2_del = client.delete(f"/api/documents/{doc_id}", headers=headers2)
    assert user2_del.status_code == 404

    # 6. Delete document by owner
    del_res = client.delete(f"/api/documents/{doc_id}", headers=auth_headers)
    assert del_res.status_code == 200
    # Confirm deletion
    get_after_del = client.get(f"/api/documents/{doc_id}", headers=auth_headers)
    assert get_after_del.status_code == 404
