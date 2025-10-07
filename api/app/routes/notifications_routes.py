from flask import Blueprint, jsonify, request
from app.services.auth_service import get_firebase_uid
from app.services.user_service import get_user_id_by_firebase_uid 
from app.services.notifications_service import get_notifications, markasread_notifications, savefcmtoken_notifications

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/notifications', methods=['GET'])
def notifications(): 
    uid, error_response, status_code = get_firebase_uid()
    if not uid:
        return error_response, status_code
 
    user_id = get_user_id_by_firebase_uid(uid)
    if not user_id:
        return jsonify({"success": False, "message": "User not found"}), 404
  
    result = get_notifications(user_id, uid)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@notifications_bp.route('/notifications/update/<int:notif_id>', methods=['POST'])
def update_notifications(notif_id):  
    uid, error_response, status_code = get_firebase_uid() 
    if not uid:
        return error_response, status_code
 
    user_id = get_user_id_by_firebase_uid(uid)
    if not user_id:
        return jsonify({"success": False, "message": "User not found"}), 404
   
    result = markasread_notifications(user_id, notif_id)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@notifications_bp.route('/notifications/fcm_token', methods=['POST'])
def save_notifications():
    uid, error_response, status_code = get_firebase_uid() 
    if not uid:
        return error_response, status_code
 
    user_id = get_user_id_by_firebase_uid(uid)
    if not user_id:
        return jsonify({"success": False, "message": "User not found"}), 404
 
    data = request.get_json()
    result = savefcmtoken_notifications(user_id, data)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code


# @notifications_bp.route('/notifications/add', methods=['POST'])
# def add_notifications(): 
#     uid, error_response, status_code = get_firebase_uid()
#     if not uid:
#         return error_response, status_code 
    
#     user_id = get_user_id_by_firebase_uid(uid)
#     if not user_id:
#         return jsonify({"success": False, "message": "User not found"}), 404
    
#     data = request.get_json()
#     result = create_notifications(user_id, data)
#     status_code = 200 if result.get("success") else 400
#     return jsonify(result), status_code