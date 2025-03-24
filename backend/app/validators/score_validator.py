from marshmallow import ValidationError


def validate_score_non_negative(user):
    """
    Validates that the user’s score is above 0 before decreasing.
    Raises a ValidationError if score is already 0 or less.
    """
    if user.score <= 0:
        raise ValidationError("User score cannot be decreased below 0.")


def validate_score_max(user):
    """
    Validates that the user’s score is below the maximum allowed (9999) before increasing.
    Raises a ValidationError if score has reached or exceeded the max.
    """
    if user.score >= 9999:
        raise ValidationError("User maximum score is 9999.")