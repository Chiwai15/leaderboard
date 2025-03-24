from functools import wraps
from flask import request
from app.tasks.event_log_task import log_event_task
from app.constants.enums import EventType
from app.repositories.user_repository import UserRepository

def log_event_decorator(event_type: EventType):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            response = fn(*args, **kwargs)

            if isinstance(response, tuple) and response[1] < 400:
                from flask import g  
                user_uuid = getattr(g, 'user_id', None)

                log_event_task.delay(
                    event=event_type.value,
                    request_meta={
                        "method": request.method,
                        "route": request.path,
                        "ip": request.remote_addr,
                        "request_data": request.get_json(silent=True),
                        "request_param": request.args.to_dict(),
                    },
                    user_id=None if user_uuid is None else UserRepository().get_id_by_uuid(user_uuid)
                )
            return response
        return wrapper
    return decorator