from flask import jsonify, send_file
from app.services.leaderboard_service import LeaderboardService
from app.constants.enums import EventType
from app.decorators.event_log_decorator import log_event_decorator

def handle_get_leaderboard():
    """
    Return the leaderboard in JSON format, ordered by score descending.
    """
    users = LeaderboardService().get_ordered_users()
    data = [
        {
            "uuid": u.uuid,
            "firstname": u.firstname,
            "lastname": u.lastname,
            "score": u.score,
            "gender": u.gender,
            "created_at": u.created_at.strftime("%Y-%m-%d")
        } for u in users
    ]
    return jsonify(data)
@log_event_decorator(EventType.EXPORT_CSV)
def handle_export_csv():
    """
    Return the leaderboard as a CSV file, ordered by score descending.
    """
    users = LeaderboardService().get_ordered_users()
    return LeaderboardService().generate_csv(users)

@log_event_decorator(EventType.EXPORT_PDF)
def handle_export_pdf():
    """
    Return the leaderboard as a PDF file, ordered by score descending.
    """
    users = LeaderboardService().get_ordered_users()
    return LeaderboardService().generate_pdf(users)
    