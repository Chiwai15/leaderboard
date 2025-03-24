# Login with username/password
from datetime import timedelta
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from app.models.user import User
from app.validators.login_validator import validate_login_payload
from app.controllers import user_controller
from app.utils.auth import admin_required

user_route = Blueprint("user_route", __name__)

@user_route.route("/login", methods=["POST"])
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

@user_route.route("/users", methods=["GET"])
@admin_required
def route_get_users():
    return user_controller.handle_get_users()


@user_route.route("/users/<string:user_id>", methods=["GET"])
@admin_required
def route_get_user(user_id):
    return user_controller.handle_get_user(user_id)


@user_route.route("/users", methods=["POST"])
@admin_required
def route_create_user():
    return user_controller.handle_create_user()


@user_route.route("/users/<string:user_id>", methods=["PATCH"])
@admin_required
def route_update_user(user_id):
    return user_controller.handle_update_user(user_id)


@user_route.route("/users/<string:user_id>", methods=["DELETE"])
@admin_required
def route_delete_user(user_id):
    return user_controller.handle_delete_user(user_id)

@user_route.route("/users/<string:user_id>/increase", methods=["PATCH"])
@admin_required
def route_increase_score(user_id):
    return user_controller.handle_score_increase(user_id)

@user_route.route("/users/<string:user_id>/decrease", methods=["PATCH"])
@admin_required
def route_decrease_score(user_id):
    return user_controller.handle_score_decrease(user_id)