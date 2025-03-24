import os
from celery import Celery
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager


db = SQLAlchemy()
jwt = JWTManager()
socketio = SocketIO(cors_allowed_origins="*", async_mode="eventlet")
celery = Celery('leaderboard', broker=os.environ.get("CELERY_BROKER_URL"))
from app.tasks.event_log_task import log_event_task
 # import log_event to celery worker
def init_socketio(app):
    socketio.init_app(app)