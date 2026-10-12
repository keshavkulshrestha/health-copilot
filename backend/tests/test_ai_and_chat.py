from app.models.document import MedicalDocument

def test_ai_summary_and_chat(client, auth_headers, db_session):
    # 1. Create a document directly in DB for testing AI features
    # Get user id from /api/auth/me
    me = client.get("/api/auth/me", headers=auth_headers).json()
    user_id = me["id"]

    sample_text = (
        "Patient: Jane Doe. Age: 32. Lab Report.\n"
        "Hemoglobin: 9.4 g/dL (Low, Reference: 12.0 - 15.5 g/dL)\n"
        "WBC Count: 7200 /cumm (Normal, Reference: 4000 - 11000)\n"
        "Platelet Count: 2.1 lakhs/cumm (Normal)\n"
        "Impression: Mild microcytic hypochromic anemia. Recommend oral iron supplementation and follow-up in 4 weeks."
    )

    doc = MedicalDocument(
        user_id=user_id,
        original_filename="blood_test.pdf",
        stored_filename="mock_stored.pdf",
        file_path="mock_path.pdf",
        file_size=1024,
        file_type="application/pdf",
        status="completed",
        extracted_text=sample_text,
        page_count=1,
        document_type="Complete Blood Count / Lab Report"
    )
    db_session.add(doc)
    db_session.commit()
    db_session.refresh(doc)

    # 2. Test AI Summarization (English)
    sum_res = client.post(
        f"/api/ai/documents/{doc.id}/summarize",
        json={"language": "en", "force_refresh": True},
        headers=auth_headers
    )
    assert sum_res.status_code == 200
    sum_data = sum_res.json()
    assert "quick_summary" in sum_data
    assert "lab_values" in sum_data
    assert len(sum_data["lab_values"]) > 0
    # Check that Hemoglobin was parsed
    hb_found = any(v["name"] == "Hemoglobin" for v in sum_data["lab_values"])
    assert hb_found
    assert sum_data["language"] == "en"

    # 3. Test AI Summarization (Hindi)
    sum_res_hi = client.post(
        f"/api/ai/documents/{doc.id}/summarize",
        json={"language": "hi", "force_refresh": True},
        headers=auth_headers
    )
    assert sum_res_hi.status_code == 200
    sum_hi_data = sum_res_hi.json()
    assert sum_hi_data["language"] == "hi"

    # 4. Create Chat Conversation
    conv_res = client.post(
        "/api/chat/conversations",
        json={"title": "Anemia Consultation", "selected_document_id": doc.id},
        headers=auth_headers
    )
    assert conv_res.status_code == 200
    conv_data = conv_res.json()
    conv_id = conv_data["id"]
    assert conv_data["title"] == "Anemia Consultation"
    # Automatic greeting message
    assert len(conv_data["messages"]) == 1

    # 5. Send message with document context
    msg_res = client.post(
        f"/api/chat/conversations/{conv_id}/messages",
        json={"content": "What does my hemoglobin level mean?", "language": "en"},
        headers=auth_headers
    )
    assert msg_res.status_code == 200
    msg_data = msg_res.json()
    assert msg_data["role"] == "assistant"
    assert len(msg_data["content"]) > 10

    # 6. Verify Conversation History
    conv_get = client.get(f"/api/chat/conversations/{conv_id}", headers=auth_headers)
    assert conv_get.status_code == 200
    # Greeting + user msg + assistant msg
    assert len(conv_get.json()["messages"]) >= 3

    # 7. Delete Conversation
    del_conv = client.delete(f"/api/chat/conversations/{conv_id}", headers=auth_headers)
    assert del_conv.status_code == 200
