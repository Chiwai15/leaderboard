import os
from flask import Flask
from flask_cors import CORS
from app.extensions import celery
from app.routes import user_route, leaderboard_route, auth_route
from app.extensions import db, jwt
from app.utils.setup import clear_sample_users, ensure_admin_user, seed_users
from app.exceptions.error_handlers import register_error_handlers
from app.extensions import db, jwt, socketio 
from dotenv import load_dotenv

load_dotenv()

# Create Flask app
def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///leaderboard.db")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "")
    app.config["ENV"] = os.getenv("FLASK_ENV", "development")  # default to development
    app.config["GENERATE_SAMPLE_DATA"] = os.getenv("GENERATE_SAMPLE_DATA", 'False') 
    frontend_origin = os.getenv("FRONTEND_ORIGIN", "*")
    CORS(app, supports_credentials=True, origins=[frontend_origin])

    # 1. Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app)

    # 2. App context: DB create, ensure superuser
    with app.app_context():
        db.create_all()
        if app.config["ENV"] != "production":
            ensure_admin_user() 
        print(os.getenv("GENERATE_SAMPLE_DATA") + "000000000---------")
        seed_users() if app.config["GENERATE_SAMPLE_DATA"] == 'True' else clear_sample_users()
            

    # 3. Register routes 
    app.register_blueprint(auth_route.auth_route)
    app.register_blueprint(user_route.user_route)
    app.register_blueprint(leaderboard_route.leaderboard_route)

    # 4. Register error handlers
    register_error_handlers(app)

    # 5. Register websocket events    
    from app.websocket import events 

    # 6. Configure Celery
    celery.conf.update(    
        task_routes={"*": {"queue": "default"}},
        task_default_queue="default",
        task_serializer="json", 
        result_serializer="json", 
        timezone="UTC", 
        enable_utc=True, 
        broker_connection_retry_on_startup = True, 
        broker_connection_max_retries = 3, 
        broker_connection_retry_delay = 5
    )
    return app

