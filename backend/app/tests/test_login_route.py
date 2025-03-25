# tests/test_login_route.py
import pytest
import sys
import os
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app import create_app
from app.extensions import db
from app.models.user import User  # adjust path as needed

@pytest.fixture
def test_client():
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False
    })

    with app.app_context():
        db.create_all()

        # Insert test user
        user = User(
            username="testuser",
            firstname="Test",
            lastname="User",
            gender="male",
            role="user"
        )
        user.set_password("correctpassword")
        db.session.add(user)
        db.session.commit()

    with app.test_client() as client:
        yield client

# 1. Successful login
def test_login_success(test_client):
    response = test_client.post("/login", json={
        "username": "testuser",
        "password": "correctpassword"
    })
    data = response.get_json()
    assert response.status_code == 200
    assert "access_token" in data

# 2. Login failure with wrong password
def test_login_wrong_password(test_client):
    response = test_client.post("/login", json={
        "username": "testuser",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

# 3. Login failure with non-existent username
def test_login_nonexistent_username(test_client):
    response = test_client.post("/login", json={
        "username": "nonexistentuser",
        "password": "somepassword"
    })
    assert response.status_code == 401

# 4. Missing username field
def test_login_missing_username(test_client):
    response = test_client.post("/login", json={
        "password": "correctpassword"
    })
    # Assuming your app returns 400 for missing fields
    assert response.status_code == 400

# 5. Missing password field
def test_login_missing_password(test_client):
    response = test_client.post("/login", json={
        "username": "testuser"
    })
    assert response.status_code == 400

# 6. Invalid JSON payload
def test_login_invalid_json(test_client):
    response = test_client.post("/login", data="Not a JSON string", content_type="application/json")
    assert response.status_code == 400

# 7. Extra fields in payload (should be ignored or handled gracefully)
def test_login_extra_fields(test_client):
    response = test_client.post("/login", json={
        "username": "testuser",
        "password": "correctpassword",
        "unexpected_field": "unexpected_value"
    })
    data = response.get_json()
    assert response.status_code == 400
    assert "access_token" in data

# 8. SQL Injection attempt
def test_login_sql_injection(test_client):
    # This simulates a malicious input
    malicious_username = "' OR '1'='1"
    response = test_client.post("/login", json={
        "username": malicious_username,
        "password": "whatever"
    })
    # Expect failure rather than unauthorized access
    assert response.status_code == 401

# 9. Direct password hash verification (testing model logic)
def test_password_hash_verification():
    # Create a user instance without DB interaction
    user = User(
        username="dummy",
        firstname="Dummy",
        lastname="User",
        gender="other",
        role="user"
    )
    user.set_password("mypassword")
    assert user.check_password("mypassword")
    assert not user.check_password("wrongpassword")
