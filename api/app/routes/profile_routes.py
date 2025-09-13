from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os 
from app.services.profile_service import get_profile, edit_profile, upload_profile, changepassword_profile, two_factor_profile, twofa_status_profile, language_profile
from app.config import Config 

secret_key = Config.SECRET_KEY

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/profile', methods=['GET'])
def profile():    
    
    user_id = int(request.args.get("userId", 0))
    result = get_profile(user_id)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@profile_bp.route('/profile/edit', methods=['POST'])
def profile_edit():    
    
    data = request.get_json()
 
    result = edit_profile(data)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@profile_bp.route('/profile/upload', methods=['POST'])
def profile_upload():     
    
    user_id = request.form.get("id")
    avatar_file = request.files.get("avatar")

    if not user_id or not avatar_file:
        return jsonify({"success": False, "message": "Missing user ID or file"}), 400

    # Convert to int (if needed)
    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({"success": False, "message": "Invalid user ID"}), 400

    try:
        basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../'))
        upload_folder = os.path.join(basedir, 'public', 'avatars')
        os.makedirs(upload_folder, exist_ok=True)

        filename = f"avatar-{user_id}-{secure_filename(avatar_file.filename)}"
        file_path = os.path.join(upload_folder, filename)
        avatar_file.save(file_path)

        avatar_url = f"/avatars/{filename}"
 
        result = upload_profile(user_id, avatar_url)

        status_code = 200 if result.get("success") else 400
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"success": False, "message": f"Upload error: {e}"}), 500
    
@profile_bp.route('/profile/changepassword', methods=['POST'])
def profile_changepassword():    
    
    data = request.get_json()
 
    result = changepassword_profile(data)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@profile_bp.route('/profile/twofa', methods=['POST'])
def profile_2fa():    
    
    data = request.get_json() 
 
    result = two_factor_profile(data)

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
        
    user_id = request.args.get("userId")  # from URL query params

    if not user_id:
        return jsonify({"success": False, "message": "Missing userId"}), 400

    result = twofa_status_profile({"userId": user_id})

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code