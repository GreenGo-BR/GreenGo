from flask import Blueprint, request, jsonify
from app.services.user_service import get_all_users

user_bp = Blueprint('users', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    result = get_all_users()
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code