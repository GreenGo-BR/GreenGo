import os 
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.services.auth_service import get_firebase_uid
from app.services.user_service import get_user_id_by_firebase_uid 
from app.services.profile_service import get_profile, edit_profile, upload_profile, changepassword_profile, two_factor_profile, twofa_status_profile, language_profile, notif_profile, darkmode_profile
from firebase_admin import auth
 

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/profile', methods=['GET'])
def profile():    
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "message": "Missing or invalid token"}), 401
    
    id_token = auth_header.split(" ")[1]

    try:

        decoded = auth.verify_id_token(id_token)
        uid = decoded["uid"]
        result = get_profile(uid)
        status_code = 200 if result.get("success") else 400
        return jsonify(result), status_code
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Token verification failed: {e}"}), 401
    
@profile_bp.route('/profile/edit', methods=['POST'])
def profile_edit():    
    
    data = request.get_json()
 
    result = edit_profile(data)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

""" @profile_bp.route('/profile/phone', methods=['POST'])
def profile_phone():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "message": "Missing or invalid token"}), 401
    
    data = request.get_json()
 
    result = phone_profile(data)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code """

@profile_bp.route('/profile/upload', methods=['POST'])
def profile_upload():

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "message": "Missing or invalid token"}), 401
    
    id_token = auth_header.split(" ")[1]

    try:

        decoded = auth.verify_id_token(id_token)
        uid = decoded["uid"]
        avatar_file = request.files.get("avatar")

        basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../'))
        upload_folder = os.path.join(basedir, 'public', 'avatars')
        os.makedirs(upload_folder, exist_ok=True)

        filename = f"avatar-{uid}-{secure_filename(avatar_file.filename)}"
        file_path = os.path.join(upload_folder, filename)
        avatar_file.save(file_path)

        avatar_url = f"/avatars/{filename}"
 
        result = upload_profile(uid, avatar_url)

        status_code = 200 if result.get("success") else 400
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "message": f"Token verification failed: {e}"}), 401 
    
@profile_bp.route('/profile/changepassword', methods=['POST'])
def profile_changepassword():    
    
    data = request.get_json()
 
    result = changepassword_profile(data)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@profile_bp.route('/profile/twofa', methods=['POST'])
def profile_2fa():
    uid, error_response, status_code = get_firebase_uid()
    if not uid:
        return error_response, status_code 
    
    data = request.get_json() 
    result = two_factor_profile(data, uid)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@profile_bp.route('/profile/language', methods=['POST'])
def profile_language():    
    
    data = request.get_json() 
 
    result = language_profile(data)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@profile_bp.route('/profile/twofa/status', methods=['GET'])
def profile_2fa_status():

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "message": "Missing or invalid token"}), 401
    
    id_token = auth_header.split(" ")[1]

    try:
        decoded = auth.verify_id_token(id_token)
        uid = decoded["uid"] 
        result = twofa_status_profile(uid)

        status_code = 200 if result.get("success") else 400
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "message": f"Token verification failed: {e}"}), 401
    
@profile_bp.route('/profile/notifications', methods=['POST'])
def profile_notifications():
    uid, error_response, status_code = get_firebase_uid()
    if not uid:
        return error_response, status_code 
    
    data = request.get_json() 
 
    result = notif_profile(data, uid)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@profile_bp.route('/profile/darkmode', methods=['POST'])
def profile_darkmode():
    uid, error_response, status_code = get_firebase_uid()
    if not uid:
        return error_response, status_code 
    
    data = request.get_json()
 
    result = darkmode_profile(data, uid)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code
