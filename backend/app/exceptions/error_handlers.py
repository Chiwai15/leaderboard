import os
from flask import jsonify
from marshmallow.exceptions import ValidationError
from app.exceptions.base import BaseServiceError
from app.exceptions.transformers import transform_integrity_error, transform_validation_error
IS_PROD = os.getenv("FLASK_ENV") == "production"
from sqlalchemy.exc import IntegrityError

def register_error_handlers(app):
    """
    Registers error handlers for the Flask app to handle various exceptions 
    such as ValidationError, BaseServiceError, IntegrityError, and generic 
    exceptions, returning appropriate JSON responses.
    """

    @app.errorhandler(ValidationError)
    def handle_validation_error(e):
        return jsonify({"error": e.messages}), 400

    @app.errorhandler(BaseServiceError)
    def handle_service_error(e):
        return jsonify(e.to_dict()), e.status_code

    @app.errorhandler(IntegrityError)
    def handle_integrity_error(e):
        transformed = transform_integrity_error(e)
        if transformed:
            return jsonify(transformed.to_dict()), transformed.status_code

        if not IS_PROD:
            return jsonify({"error": str(e), "type": "IntegrityError"}), 500
        return jsonify({"error": "Database integrity error"}), 500

    @app.errorhandler(Exception)
    def handle_unexpected_error(e):
        if True:
            return jsonify({"error": str(e), "type": type(e).__name__}), 500
        return jsonify({"error": "Something went wrong"}), 500