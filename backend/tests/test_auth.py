def test_register_and_login_flow(client):
    # 1. Register new account
    reg_res = client.post(
        "/api/auth/register",
        json={
            "email": "user1@medimind.ai",
            "password": "SecurePassword99",
            "full_name": "Test User",
            "age": 28,
            "gender": "Male",
            "blood_group": "O+"
        }
    )
    assert reg_res.status_code == 200
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == "user1@medimind.ai"
    assert reg_data["user"]["preference"]["language"] == "en"

    # 2. Duplicate registration rejection
    dup_res = client.post(
        "/api/auth/register",
        json={
            "email": "user1@medimind.ai",
            "password": "AnotherPassword"
        }
    )
    assert dup_res.status_code == 400

    # 3. Valid Login
    login_res = client.post(
        "/api/auth/login",
        json={
            "email": "user1@medimind.ai",
            "password": "SecurePassword99"
        }
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    # 4. Invalid Password Login
    bad_login = client.post(
        "/api/auth/login",
        json={
            "email": "user1@medimind.ai",
            "password": "WrongPassword"
        }
    )
    assert bad_login.status_code == 401

    # 5. Fetch /api/auth/me
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "user1@medimind.ai"

    # 6. Update Profile
    update_res = client.patch(
        "/api/users/me",
        json={"full_name": "Updated Full Name", "age": 29},
        headers=headers
    )
    assert update_res.status_code == 200
    assert update_res.json()["full_name"] == "Updated Full Name"
    assert update_res.json()["age"] == 29

    # 7. Update Preferences
    pref_res = client.patch(
        "/api/users/me/preferences",
        json={"language": "hi", "theme": "dark"},
        headers=headers
    )
    assert pref_res.status_code == 200
    assert pref_res.json()["language"] == "hi"
    assert pref_res.json()["theme"] == "dark"
