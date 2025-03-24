from flask import request, has_request_context
from app.extensions import db
from app.models.event_log import EventLog, EventType, HttpMethod
from datetime import datetime, timezone


class EventLogger: 
    def log_event(
        self,
        event: EventType,
        user_id: int = None,
        error: str = None,
    ):
        """
        Logs an event in the database.

        :param event: The type of event to log
        :param user_id: The ID of the user associated with the event (optional)
        :param error: An error message to log with the event (optional)
        """
        if not has_request_context():
            raise RuntimeError("No request context. Cannot log event.")

        method = HttpMethod(request.method)
        route = request.path
        ip = request.remote_addr
        request_data = request.get_json(silent=True)
        request_param = request.args.to_dict()

        log = EventLog(
            created_at=datetime.now(timezone.utc),
            event=event,
            method=method,
            route=route,
            ip=ip,
            request_data=request_data,
            request_param=request_param,
            error=error,
            user_id=user_id
        )

        db.session.add(log)
        db.session.commit()