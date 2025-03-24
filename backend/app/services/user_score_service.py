class UserScoreService:
    def __init__(self, user_repo):
        self.user_repo = user_repo

    def increase_score(self, user):
        user.score += 1
        return self.user_repo.update(user)

    def decrease_score(self, user):
        user.score -= 1
        return self.user_repo.update(user)