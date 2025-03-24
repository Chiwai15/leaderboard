class BaseServiceError(Exception):
    """Base exception for known service-level errors."""
    status_code = 400

    def __init__(self, message="An error occurred", status_code=None):
        super().__init__(message)
        if status_code is not None:
            self.status_code = status_code
        self.message = message

    def to_dict(self):
        return {"error": self.message}

class NotFoundError(BaseServiceError):
    status_code = 404

class DuplicateEntryError(BaseServiceError):
    status_code = 409