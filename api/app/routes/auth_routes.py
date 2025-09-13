from flask import Blueprint, request, jsonify
from app.services.auth_service import authenticate_user, register_user, twofa_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    remember_me = str(data.get("rememberMe")).lower() == "true"

    print("Raw remember_me value:", data.get("rememberMe"))
    print("Final remember_me bool:", remember_me)

    result = authenticate_user(email, password, remember_me)
    status_code = 200 if result.get("success") else 401
    return jsonify(result), status_code

@auth_bp.route('/register', methods=['POST'])
def register():  

    name = request.form.get("name")
    email = request.form.get("email")
    cpf = request.form.get("cpf")
    country = request.form.get("country")
    password = request.form.get("password")
    profile_image_base64 = request.files.get("avatar")
    
    data = {
        "name": name,
        "email": email,
        "cpf": cpf,
        "country": country,
        "password": password, 
        "profile_image_base64": profile_image_base64,
    } 
    result = register_user(data)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@auth_bp.route('/verify_2fa', methods=['POST'])
def verify_2fa():  

    data = request.get_json()
    code = data.get("code")
    temp_token = data.get("temp_token")

    if not code or not temp_token:
            return jsonify({"success": False, "message": "Missing code or token."}), 400
    
    data = {
        "code": code,
        "temp_token": temp_token, 
    } 
    result = twofa_user(data)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code