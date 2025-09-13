from flask import Blueprint, request, jsonify
import jwt
from app.services.collections_details_service import get_collections_details, cancel_collection_by_id, reschedule_collection_by_id
from app.config import Config

secret_key = Config.SECRET_KEY

collections_details_bp = Blueprint('collections_details', __name__)

def decode_token(auth_header):
    if not auth_header or not auth_header.startswith("Bearer "):
        print("Missing or malformed Authorization header")
        return None
    try: 
        token = auth_header.split(" ")[1]
        decoded = jwt.decode(token, secret_key, algorithms=["HS256"])
       
        return decoded
    except jwt.ExpiredSignatureError:
        print("Token expired")
        return None
    except jwt.InvalidTokenError:
        print("Invalid token")
        return None

@collections_details_bp.route('/collections_details', methods=['GET'])
def collections_details():
    auth_header = request.headers.get("Authorization") 
    user = decode_token(auth_header)

    if not user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    collection_id = int(request.args.get("id", 0))
    if not collection_id:
        return jsonify({"success": False, "message": "Missing collection ID"}), 400

    result = get_collections_details(collection_id)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@collections_details_bp.route('/collections_details/cancelled', methods=['POST'])
def cancel_collection():
    auth_header = request.headers.get("Authorization")
    user = decode_token(auth_header)

    if not user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
    data = request.get_json()
    coldet_id = data.get("id")
    cancel_reason = data.get("reason")

    result = cancel_collection_by_id(coldet_id, cancel_reason) 
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@collections_details_bp.route('/collections/<collection_id>/reschedule', methods=['POST'])
def reschedule_collection(collection_id):
    auth_header = request.headers.get("Authorization")
    user = decode_token(auth_header)

    if not user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    data = request.json
    new_date = data.get("date")
    new_time = data.get("time")

    if not new_date or not new_time:
        return jsonify({"success": False, "message": "Missing date or time."}), 400

    try:
        success = reschedule_collection_by_id(collection_id, new_date, new_time)
        if success:
            return jsonify({"success": True, "message": "Coleta reagendada com sucesso."}), 200
        else:
            return jsonify({"success": False, "message": "Não foi possível reagendar."}), 400
    except Exception as e:
        print("Error rescheduling collection:", e)
        return jsonify({"success": False, "message": "Erro interno no servidor."}), 500