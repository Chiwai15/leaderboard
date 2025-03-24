from app.models.user import User
from app.extensions import db

class UserRepository:
    def get_by_id(self, user_id: str) -> User:
        user = User.query.filter_by(uuid=user_id).first()
        if not user:
            raise ValueError("User not found")
        return user

    def get_by_username(self, username: str) -> User | None:
        return User.query.filter_by(username=username).first()
    
    def get_id_by_uuid(self, uuid: str) -> User | None:
        user = User.query.filter_by(uuid=uuid).first()
        return user.id if user else None

    def get_all(self) -> list[User]:
        return User.query.all()

    def create(self, user: User) -> User:
        db.session.add(user)
        db.session.commit()
        return user

    def update(self, user: User) -> User:
        db.session.commit()
        return user

    def delete(self, user: User) -> None:
        db.session.delete(user)
        db.session.commit()

    def get_leaderboard_ordered(self):
        return User.query.order_by(User.score.desc()).all()