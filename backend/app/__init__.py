import os
from flask import Flask
from flask_cors import CORS
from app.routes import user_route, leaderboard_route
from app.extensions import db, jwt
from app.utils.setup import ensure_admin_user, seed_users
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
            seed_users()


    # 3. Register routes 
    app.register_blueprint(user_route.user_route)
    app.register_blueprint(leaderboard_route.leaderboard_route)

    # 4. Register error handlers
    register_error_handlers(app)

    # 5. Register websocket events    
    from app.websocket import events 
    return app

