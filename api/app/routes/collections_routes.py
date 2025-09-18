from flask import Blueprint, jsonify, request
from app.services.collections_service import get_collections
from app.models.db import get_db_connection_string
import pyodbc
from firebase_admin import auth

collections_bp = Blueprint('collections', __name__)

@collections_bp.route('/collections', methods=['GET'])
def collections():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "message": "Missing or invalid token"}), 401

    id_token = auth_header.split(" ")[1]

    try:
        decoded = auth.verify_id_token(id_token)
        uid = decoded["uid"]   # ✅ Firebase UID
    except Exception as e:
        return jsonify({"success": False, "message": f"Token verification failed: {e}"}), 401
 
    conn_str = get_db_connection_string()
    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor()
        cursor.execute("SELECT UserID FROM Users WHERE firebase_uid = ?", (uid,))
        row = cursor.fetchone()

        if not row:
            return jsonify({"success": False, "message": "User not found"}), 404

        userid = row[0]

    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close()

    # Pass userid into service
    result = get_collections(userid)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code
