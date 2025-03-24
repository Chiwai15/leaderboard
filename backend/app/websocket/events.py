from app.extensions import socketio
from flask import request
from flask_jwt_extended import decode_token
from flask_socketio import emit
from app.websocket.websocket_manager import WebSocketManager

sid_user_map = {}  # for user tracking
user_sid_map = {}
   
@socketio.on("connect")
def handle_connect(auth):
    """
    Handle client connection event.

    Upon connection, the client is joined to the global room and the mapping of sid to user_id is stored.
    If the user already has a previous sid, that sid is disconnected.
    """
    namespace = request.namespace or "/"  # default
    global_room = socketio.server.manager.rooms[namespace].get("global", {})
    all_sids = list(global_room)
    print(f"Users in global room: {all_sids}")
    emit("global_users", {"sids": all_sids})

    try:
        token = auth.get("token")
        decoded = decode_token(token)
        user_id = decoded["sub"]
        sid = request.sid

        # Check if user already has a previous sid
        old_sid = user_sid_map.get(user_id)
        if old_sid and old_sid != sid:
            print(f"Evicting old sid for user {user_id}: {old_sid}")
            socketio.server.disconnect(old_sid)

        # Track new sid <-> user_id mapping
        sid_user_map[sid] = user_id
        user_sid_map[user_id] = sid

        WebSocketManager.join_room(sid, "global")
        print(f"User {user_id} connected with sid: {sid}")

    except Exception as e:
        print("Connection failed:", e)
        return False

@socketio.on("disconnect")
def handle_disconnect():
    """
    Handle client disconnection event.

    When a client disconnects, the sid to user_id mapping is removed and the user is left from the global room.
    """
    sid = request.sid
    user_id = sid_user_map.pop(sid, None)
    WebSocketManager.leave_room(sid, "global")
    print(f"Disconnected: {sid}, user: {user_id}")

@socketio.on("list_global_users")
def handle_list_global_users():
    """
    Handle a request to list all users currently connected to the global room.

    Returns the list of all sids in the global room.
    """
    namespace = request.namespace or "/"  # default
    global_room = socketio.server.manager.rooms[namespace].get("global", {})
    all_sids = list(global_room)
    print(f"Users in global room: {all_sids}")
    emit("global_users", {"sids": all_sids})

