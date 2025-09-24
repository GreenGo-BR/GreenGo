from flask import Blueprint, jsonify, request
from app.services.auth_service import get_firebase_uid
from app.services.user_service import get_user_id_by_firebase_uid  
from app.services.collections_service import get_collections

collections_bp = Blueprint('collections', __name__)

@collections_bp.route('/collections', methods=['GET'])
def collections():
    uid, error_response, status_code = get_firebase_uid()
    if not uid:
        return error_response, status_code

    user_id = get_user_id_by_firebase_uid(uid)
    if not user_id:
        return jsonify({"success": False, "message": "User not found"}), 404
    
    result = get_collections(user_id)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code
