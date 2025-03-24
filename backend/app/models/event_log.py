from app.constants.enums import EventType
from app.extensions import db
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy import Enum as PgEnum
from datetime import datetime, timezone

from app.constants.enums import HttpMethod


class EventLog(db.Model):
    __tablename__ = "event_logs"

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    method = db.Column(PgEnum(HttpMethod), nullable=False)
    event = db.Column(PgEnum(EventType), nullable=False)

    route = db.Column(db.String(255), nullable=False)
    ip = db.Column(db.String(64), nullable=True)

    request_data = db.Column(db.JSON, nullable=True)
    request_param = db.Column(db.JSON, nullable=True)
    error = db.Column(db.Text, nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
