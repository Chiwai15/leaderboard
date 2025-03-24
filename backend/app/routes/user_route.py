# Login with username/password
from datetime import timedelta
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from app.models.user import User
from app.validators.login_validator import validate_login_payload
from app.controllers import user_controller
from app.utils.auth import admin_required
from app.decorators.websocket_decorator import broadcast_event
from app.repositories.user_repository import UserRepository
from app.constants.enums import EventType

user_route = Blueprint("user_route", __name__)

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
@broadcast_event(EventType.USER_CREATE.value)
def route_create_user():
    return user_controller.handle_create_user()


@user_route.route("/users/<string:user_id>", methods=["PATCH"])
@admin_required
@broadcast_event(EventType.USER_UPDATE.value)
def route_update_user(user_id):
    return user_controller.handle_update_user(user_id)


@user_route.route("/users/<string:user_id>", methods=["DELETE"])
@admin_required
@broadcast_event(EventType.USER_DELETE.value)
def route_delete_user(user_id):
    return user_controller.handle_delete_user(user_id)

@user_route.route("/users/<string:user_id>/increase", methods=["PATCH"])
@admin_required
@broadcast_event(EventType.SCORE_INCREASE.value)
def route_increase_score(user_id):
    print(f'route_increase_score: {user_id}')
    return user_controller.handle_score_increase(user_id)

@user_route.route("/users/<string:user_id>/decrease", methods=["PATCH"])
@admin_required
@broadcast_event(EventType.SCORE_DECREASE.value)
def route_decrease_score(user_id):
    return user_controller.handle_score_decrease(user_id)