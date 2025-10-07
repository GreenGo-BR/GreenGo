from flask import Blueprint, jsonify
from app.services.auth_service import get_firebase_uid
from app.services.user_service import get_user_id_by_firebase_uid 
from app.services.wallet_service import get_walletstatement, get_walletaccountsummary, get_wallethomedata

wallet_bp = Blueprint('wallet', __name__)

@wallet_bp.route('/walletstatement', methods=['GET'])
def walletstatement_methods(): 
    uid, error_response, status_code = get_firebase_uid()
    if not uid:
        return error_response, status_code
 
    user_id = get_user_id_by_firebase_uid(uid)
    if not user_id:
        return jsonify({"success": False, "message": "User not found"}), 404
  
    result = get_walletstatement(user_id)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@wallet_bp.route('/walletaccountsummary', methods=['GET'])
def walletaccountsummary_methods(): 
    uid, error_response, status_code = get_firebase_uid()
    if not uid:
        return error_response, status_code
 
    user_id = get_user_id_by_firebase_uid(uid)
    if not user_id:
        return jsonify({"success": False, "message": "User not found"}), 404
  
    result = get_walletaccountsummary(user_id)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@wallet_bp.route('/wallethomedata', methods=['GET'])
def wallethomedata_methods(): 
    uid, error_response, status_code = get_firebase_uid()
    if not uid:
        return error_response, status_code
 
    user_id = get_user_id_by_firebase_uid(uid)
    if not user_id:
        return jsonify({"success": False, "message": "User not found"}), 404
  
    result = get_wallethomedata(user_id)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code
    uid, error_response, status_code = get_firebase_uid()
    if not uid:
        return error_response, status_code 
    
    user_id = get_user_id_by_firebase_uid(uid)
    if not user_id:
        return jsonify({"success": False, "message": "User not found"}), 404
     
    result = default_pm(user_id, uid, pm_id)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code