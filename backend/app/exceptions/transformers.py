from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from app.exceptions.base import DuplicateEntryError

def transform_integrity_error(error: IntegrityError):
    """
    Transforms known DB errors into service-layer exceptions.
    Extendable: add more rules without touching the main handler.
    """
    if "Duplicate entry" in str(error.orig):
        return DuplicateEntryError(message="Duplicate entry")
    return None

def transform_validation_error(error: ValidationError):
    return None
