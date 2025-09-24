from flask import Blueprint, request, jsonify 

from app.services.auth_service import authenticate_user, register_user, twofa_user 

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "message": "Missing or invalid Authorization header"}), 401

    id_token = auth_header.split("Bearer ")[1]

    try:  
        
        """   decoded = auth.verify_id_token(id_token, clock_skew_seconds=60)
        uid = decoded["uid"]
        email = decoded.get("email")
        phone = decoded.get("phone_number") """

        result = authenticate_user(id_token)

        status_code = 200 if result.get("success") else 400
        return jsonify(result), status_code
        
        """ return jsonify({
            "success": True,
            "message": "Authentication successful",
            "uid": uid,
            "email": email,
            "phone" : phone,
            "twofa_enabled" : userinfo.twofa_enabled
        }), 200 """

    except Exception as e:
        return jsonify({"success": False, "message": f"Invalid token: {e}"}), 401 

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