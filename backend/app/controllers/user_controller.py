from app.constants.enums import EventType
from flask import request, jsonify
from app.validators.user_validator import validate_create_user_payload, validate_delete_user_payload, validate_update_user_payload
from app.repositories.user_repository import UserRepository
from app.services.user_profile_service import UserProfileService

from app.services.user_score_service import UserScoreService
from app.validators.score_validator import validate_score_max, validate_score_non_negative
from app.decorators.event_log_decorator import log_event_decorator


def extract_request_meta():
    return {
        "method": request.method,
        "route": request.path,
        "ip": request.remote_addr,
        "request_data": request.get_json(silent=True),
        "request_param": request.args.to_dict(),
    }

def handle_get_users():
    return jsonify([user.to_dict() for user in UserRepository().get_all()]), 200

def handle_get_user(user_id: str):
    return jsonify(UserRepository().get_by_id(user_id).to_dict()), 200

@log_event_decorator(EventType.USER_CREATE)
def handle_create_user():
    payload = request.get_json() or {}
    validated = validate_create_user_payload(payload)

    repo = UserRepository()
    service = UserProfileService(repo)
    user = service.create_user_from_data(validated, repo)
    return jsonify({"message": "User created", "data": user.to_dict()}), 201

@log_event_decorator(EventType.USER_UPDATE)
def handle_update_user(user_id: str):
    payload = request.get_json() or {}
    validated = validate_update_user_payload(payload)

    repo = UserRepository()
    user = repo.get_by_id(user_id)
    service = UserProfileService(repo)
    updated_user = service.update_user_fields(user, validated, repo)

    return jsonify({"message": "User updated","data": updated_user.to_dict()}), 200

@log_event_decorator(EventType.USER_DELETE)
def handle_delete_user(user_id: str):
    user_repo = UserRepository()
    user = user_repo.get_by_id(user_id)

    validate_delete_user_payload(user)  # can raise ValidationError
    print("handle_delete_user************")
    user_repo.delete(user)
    return jsonify({"message": "User deleted"}), 200

@log_event_decorator(EventType.SCORE_INCREASE)
def handle_score_increase(user_id: str):
    repo = UserRepository()
    user = repo.get_by_id(user_id)

    validate_score_max(user)

    service = UserScoreService(repo)
    updated_user = service.increase_score(user)

    return jsonify({
        "message": "Score increased",
        "new_score": updated_user.score
    }), 200

@log_event_decorator(EventType.SCORE_DECREASE)
def handle_score_decrease(user_id: str):
    repo = UserRepository()
    user = repo.get_by_id(user_id)

    validate_score_non_negative(user)

    service = UserScoreService(repo)
    updated_user = service.decrease_score(user)

    return jsonify({
        "message": "Score decreased",
        "new_score": updated_user.score
    }), 200