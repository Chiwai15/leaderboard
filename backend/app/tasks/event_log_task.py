from app.extensions import celery
from datetime import datetime
import json

@celery.task(name="log_event_task")
def log_event_task(event, request_meta, user_id=None, error=None):
    from app.constants.enums import EventType  # optional late import

    try:
        print(f"[LogEventTask] Starting log for event: {event}")
        print(f"[LogEventTask] Meta: {request_meta}")
        print(f"[LogEventTask] User ID: {user_id},  Error: {error}")

        from app import create_app
        from app.extensions import db
        from app.models.event_log import EventLog

        app = create_app()

        with app.app_context():
            log = EventLog(
                created_at=datetime.utcnow(),
                method=request_meta.get("method"),
                event=event,
                route=request_meta.get("route"),
                ip=request_meta.get("ip"),
                request_data=json.dumps(request_meta.get("request_data", {})),
                request_param=json.dumps(request_meta.get("request_param", {})),
                error=error,
                user_id=user_id,
            )

            db.session.add(log)
            db.session.commit()

    except Exception as e:
        print(f"[Celery Log Error] {str(e)}")