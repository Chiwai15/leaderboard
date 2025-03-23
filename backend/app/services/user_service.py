
from app.models.user import User
from app.extensions import db
import os

def ensure_admin_user():
    admin_username = os.getenv("ADMIN_USERNAME", "admin")
    admin_password = os.getenv("ADMIN_PASSWORD", "admin")

    existing_admin = User.query.filter_by(username=admin_username, role="admin").first()
    if not existing_admin:
        print(f"Creating admin user: {admin_username}")
        admin = User(
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
