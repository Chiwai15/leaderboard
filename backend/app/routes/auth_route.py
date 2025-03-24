from datetime import timedelta
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token

from app.models.user import User
from app.validators.login_validator import validate_login_payload


auth_route = Blueprint("auth_route", __name__)

@auth_route.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    validated = validate_login_payload(data)

    user = User.query.filter_by(username=validated["username"]).first()
    if not user or not user.check_password(validated["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role}, 
        expires_delta=timedelta(hours=2)
    )
    return jsonify(access_token=token, role=user.role, user=user.to_dict()), 200