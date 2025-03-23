import pytest
from app.models.user import User

@pytest.fixture
def test_user(db_session):
    user = User(username="test", role="admin")
    user.set_password("secret123")
    user.firstname = "Test"
    user.lastname = "User" 
    user.score = 100
    user.gender = "male"
    db_session.add(user)
    db_session.commit()
    return user

def test_login_success(client, test_user):
    response = client.post("/login", json={
        "username": "test",
        "password": "secret123"
    })

    assert response.status_code == 200
    data = response.get_json()
    assert "access_token" in data
    assert data["role"] == "admin"