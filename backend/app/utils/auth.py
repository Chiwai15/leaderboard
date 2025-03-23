from datetime import datetime, timedelta
from flask_jwt_extended import jwt_required, get_jwt
from flask import jsonify
import jwt

SECRET_KEY = "super-secret-key"  # Replace with environment variable in production
ALGORITHM = "HS256"
TOKEN_EXPIRY_HOURS = 2

def generate_token(user_id: int):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=TOKEN_EXPIRY_HOURS)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")

def admin_required(fn):
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        print(claims.get("role"))
        if claims.get("role") != "admin":
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper

