from app.repositories.user_repository import UserRepository
from app.utils.export import export_csv, export_pdf  # your utility logic

class LeaderboardService:
    def __init__(self):
        self.user_repo = UserRepository()

    def get_ordered_users(self):
        return self.user_repo.get_leaderboard_ordered()

    def generate_csv(self, users):
        return export_csv(users)

    def generate_pdf(self, users):
        return export_pdf(users)