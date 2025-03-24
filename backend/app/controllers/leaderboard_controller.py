from flask import jsonify, send_file
from app.services.leaderboard_service import LeaderboardService

def handle_get_leaderboard():
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

def handle_export_csv():
    users = LeaderboardService().get_ordered_users()
    csv_path = LeaderboardService().generate_csv(users)
    return send_file(csv_path, as_attachment=True)

def handle_export_pdf():
    users = LeaderboardService().get_ordered_users()
    pdf_path = LeaderboardService().generate_pdf(users)
    return send_file(pdf_path, as_attachment=True)