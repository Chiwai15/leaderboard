import os
from app.models.user import User
from app.extensions import db
from app.seeds.test_users import test_users

def ensure_admin_user():
    admin_username = os.getenv("ADMIN_USERNAME", "admin")
    admin_password = os.getenv("ADMIN_PASSWORD", "admin")
    existing_admin = User.query.filter_by(username=admin_username, role="admin").first()
    if not existing_admin:
        print(f"Creating admin user: {admin_username}")
        admin = User(
            uuid= "7ae127fb",
            username=admin_username,
            firstname="Super",
            lastname="Admin",
            gender="other",
            score=9999,
            role="admin"
        )
        admin.password_hash = admin_password
        db.session.add(admin)
        db.session.commit()

def seed_users():
    for data in test_users:
        if not User.query.filter_by(username=data["username"]).first():
            user = User(
                uuid=data["uuid"],
                username=data["username"],
                firstname=data["firstname"],
                lastname=data["lastname"],
                gender=data["gender"],
                score=data["score"],
                role=data["role"]
            )
            user.password_hash = data["password"]  # triggers hash
            db.session.add(user)
    db.session.commit()