from datetime import datetime, timezone
from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
# User Model
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True) 
    uuid = db.Column(db.String(8), unique=True, default=lambda: str(uuid.uuid4())[:8])
    username = db.Column(db.String(80), nullable=False, unique=True)  
    firstname = db.Column(db.String(80), nullable=False)
    lastname = db.Column(db.String(80), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    score = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    role = db.Column(db.String(10), nullable=False, default="user")  # 'admin' or 'user'
    _password_hash = db.Column("password_hash", db.String(255), nullable=False)

    @property
    def password_hash(self):
        raise AttributeError("Password is write-only.")

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = generate_password_hash(password)

    def set_password(self, password):
        self.password_hash = password 
    
    def check_password(self, password):
        return check_password_hash(self._password_hash, password)
    
    def to_dict(self):
        return {
            "uuid": self.uuid,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "gender": self.gender,
            "score": self.score,
            "role": self.role,
            "created_at": self.created_at.isoformat()
            # No password_hash
        }