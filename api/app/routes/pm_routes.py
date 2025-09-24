from flask import Blueprint, jsonify, request
from app.services.auth_service import get_firebase_uid
from app.services.user_service import get_user_id_by_firebase_uid 
from app.services.pm_service import get_pm, create_pm, delete_pm, default_pm

rm_bp = Blueprint('pm', __name__)

@rm_bp.route('/payment_methods', methods=['GET'])
def payment_methods(): 
    uid, error_response, status_code = get_firebase_uid()
    if not uid:
        return error_response, status_code
 
    user_id = get_user_id_by_firebase_uid(uid)
    if not user_id:
        return jsonify({"success": False, "message": "User not found"}), 404
  
    result = get_pm(user_id, uid)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@rm_bp.route('/payment_methods/add', methods=['POST'])
def create_payment_methods(): 
    uid, error_response, status_code = get_firebase_uid()
    if not uid:
        return error_response, status_code
 
    user_id = get_user_id_by_firebase_uid(uid)
    if not user_id:
        return jsonify({"success": False, "message": "User not found"}), 404
  
    data = request.get_json() 
    result = create_pm(user_id, uid, data)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@rm_bp.route('/payment_methods/delete/<int:pm_id>', methods=['DELETE'])
def delete_payment_methods(pm_id): 
    uid, error_response, status_code = get_firebase_uid()
    if not uid:
        return error_response, status_code
 
    user_id = get_user_id_by_firebase_uid(uid)
    if not user_id:
        return jsonify({"success": False, "message": "User not found"}), 404
     
    result = delete_pm(user_id, uid, pm_id)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@rm_bp.route('/payment_methods/set_default/<int:pm_id>', methods=['POST'])
def default_payment_methods(pm_id): 
    uid, error_response, status_code = get_firebase_uid()
    if not uid:
        return error_response, status_code 
    
    user_id = get_user_id_by_firebase_uid(uid)
    if not user_id:
        return jsonify({"success": False, "message": "User not found"}), 404
     
    result = default_pm(user_id, uid, pm_id)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code