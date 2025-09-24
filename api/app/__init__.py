import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from app.routes.auth_routes import auth_bp 
from app.routes.schedule_routes import schedule_bp
from app.routes.collections_routes import collections_bp
from app.routes.collections_details_routes import collections_details_bp
from app.routes.db_routes import db_bp
from app.routes.profile_routes import profile_bp
from app.routes.password_routes import reset_password_bp
from app.routes.pm_routes import rm_bp
from app.routes.notifications_routes import notifications_bp
# from app.routes.register_routes import register_bp
from app.firebase_setup import init_firebase

load_dotenv()

def create_app():
    app = Flask(__name__) 
    app.config.from_object('app.config.Config')
    CORS(app)

    init_firebase()

    app.register_blueprint(auth_bp, url_prefix="/api")
    # app.register_blueprint(user_bp, url_prefix='/api') 
    app.register_blueprint(schedule_bp, url_prefix='/api') 
    app.register_blueprint(collections_bp, url_prefix='/api') 
    app.register_blueprint(collections_details_bp, url_prefix='/api')
    app.register_blueprint(profile_bp, url_prefix='/api') 
    app.register_blueprint(db_bp, url_prefix='/api') 
    app.register_blueprint(reset_password_bp, url_prefix='/api')
    app.register_blueprint(rm_bp, url_prefix='/api')
    app.register_blueprint(notifications_bp, url_prefix='/api')
    # app.register_blueprint(register_bp, url_prefix='/api')
    
    return app