from flask import Blueprint, jsonify
from app.services.db_service import check_db_connection

db_bp = Blueprint('db', __name__)

@db_bp.route('/db-check', methods=['GET'])
def db_check():
    result = check_db_connection()
    status = 200 if result.get("success") else 500
    return jsonify(result), status