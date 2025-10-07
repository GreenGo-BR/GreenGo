from flask import Blueprint, request, jsonify 
from app.services.auth_service import get_firebase_uid
from app.services.user_service import get_user_id_by_firebase_uid 
from app.services.auth_service import authenticate_user, register_user, twofa_user 

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    uid, error_response, status_code = get_firebase_uid()
    if not uid:
        return error_response, status_code
 
    user_id = get_user_id_by_firebase_uid(uid)
    if not user_id:
        return jsonify({"success": False, "message": "User not found"}), 404
 
    result = authenticate_user(user_id, uid)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code 

@auth_bp.route('/register', methods=['POST'])
def register():  

    firebase_uid = request.form.get("firebase_uid")
    name = request.form.get("name")
    email = request.form.get("email")
    cpf = request.form.get("cpf")
    country = request.form.get("country")
    avatar_file = request.files.get("avatar")
    
    data = {
        "firebase_uid": firebase_uid,
        "name": name,
        "email": email,
        "cpf": cpf,
        "country": country, 
        "avatar_filename": avatar_file.filename if avatar_file else None,
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