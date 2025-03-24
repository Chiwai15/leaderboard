from enum import Enum


class EventType(Enum):
    SCORE_DECREASE = "SCORE_DECREASE"
    SCORE_INCREASE = "SCORE_INCREASE"
    USER_CREATE = "USER_CREATE"
    USER_DELETE = "USER_DELETE"
    USER_UPDATE = "USER_UPDATE"
    EXPORT_PDF = "EXPORT_PDF"
    EXPORT_CSV = "EXPORT_CSV"
    LOGIN = "LOGIN"

class HttpMethod(Enum):
    GET = "GET"
    POST = "POST"
    PATCH = "PATCH"
    DELETE = "DELETE"
    PUT = "PUT"
