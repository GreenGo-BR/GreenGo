from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename 
from app.services.password_service import reset_password, set_new_password
from app.config import Config 
secret_key = Config.SECRET_KEY

reset_password_bp = Blueprint('password', __name__)

@reset_password_bp.route('/reset_password', methods=['post'])
def password():    
    
    data = request.get_json()
    email = data.get("email")
    result = reset_password(email)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@reset_password_bp.route('/reset_password/new', methods=['post'])
def new_password():    
    
    data = request.get_json() 

    result = set_new_password(data)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code
