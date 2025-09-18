from flask import Blueprint, request, jsonify
import pyodbc 
from app.services.schedule_service import schedule_collections
from app.models.db import get_db_connection_string
from firebase_admin import auth

schedule_bp = Blueprint('schedule', __name__)

@schedule_bp.route('/schedule', methods=['POST'])
def schedule():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "message": "Missing or invalid token"}), 401
    
    id_token = auth_header.split(" ")[1]

    try:
        decoded = auth.verify_id_token(id_token)
        uid = decoded["uid"] 
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

    data = request.get_json()   
    result = schedule_collections(data, userid)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code
    
    
   