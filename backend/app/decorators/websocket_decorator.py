from functools import wraps
from app.websocket.websocket_manager import WebSocketManager
from app.repositories.user_repository import UserRepository

def broadcast_event(change_type: str):
    """
    Broadcasts a data_change event with the given change_type after the decorated function has been called.

    :param change_type: The type of data change event to broadcast
    :type change_type: str
    :return: A decorator function
    :rtype: Callable[[Callable], Callable]
    """
    def decorator(fn):
        
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_id = kwargs.get("user_id") if "user_id" in kwargs else args[0] if args else None
            uuid = None if user_id is None else UserRepository().get_by_id(user_id).uuid
            result = fn(*args, **kwargs)
            data = {
                "event": change_type,
                "data": {"uuid": uuid}
            }
            WebSocketManager.broadcast_event("data_change", data)
            return result
        return wrapper
    return decorator