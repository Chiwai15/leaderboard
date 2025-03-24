from flask_socketio import emit
from app.extensions import socketio

class WebSocketManager:
    @staticmethod
    def broadcast_event(event_name, data, room="global"):
        print(f"Broadcasting {event_name} to {room}: {data}")
        socketio.emit(event_name, data, to=room)

    @staticmethod
    def send_private_event(event_name, data, room):
        socketio.emit(event_name, data, to=room)

    @staticmethod
    def join_room(sid, room):
        from flask_socketio import join_room
        join_room(room, sid=sid)

    @staticmethod
    def leave_room(sid, room):
        from flask_socketio import leave_room
        leave_room(room, sid=sid)

