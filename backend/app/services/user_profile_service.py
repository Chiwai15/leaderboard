
from app.models.user import User
from app.extensions import db
import os

from app.repositories.user_repository import UserRepository

class UserProfileService:
    def __init__(self, user_repo):
        self.user_repo = user_repo
    def create_user_from_data(data: dict, repo: UserRepository) -> User:
        allowed_fields = ["username", "firstname", "lastname", "gender", "score", "role"]
        user = User()

        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])

        if "password" in data:
            user.password_hash = data["password"]

        return repo.create(user)  # delegate persistence

    def update_user_fields(user: User, data: dict, repo: UserRepository) -> User:
        allowed_fields = ["username", "firstname", "lastname", "gender", "score"]

        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])

        if "password" in data:
            user.password_hash = data["password"] # This triggers the password hashing logic

        return repo.update(user)  # delegate persistence


