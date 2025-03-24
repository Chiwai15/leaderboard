from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.utils.auth import admin_required
from app.controllers.leaderboard_controller import (
    handle_get_leaderboard,
    handle_export_csv,
    handle_export_pdf
)
from app.websocket.broadcast import broadcast_event

leaderboard_route = Blueprint("leaderboard_route", __name__)

@leaderboard_route.route("/leaderboard", methods=["GET"])
@jwt_required()
def route_get_leaderboard():
    return handle_get_leaderboard()

@leaderboard_route.route("/export/csv", methods=["GET"])
@admin_required
def route_export_leaderboard_csv():
    return handle_export_csv()

@leaderboard_route.route("/export/pdf", methods=["GET"])
@admin_required
def route_export_leaderboard_pdf():
    return handle_export_pdf()