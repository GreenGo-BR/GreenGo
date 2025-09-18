from flask import Blueprint, request, jsonify
import jwt
from app.services.collections_details_service import get_collections_details, cancel_collection_by_id
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
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "message": "Missing or invalid token"}), 401 

    collection_id = int(request.args.get("id", 0))
    if not collection_id:
        return jsonify({"success": False, "message": "Missing collection ID"}), 400

    result = get_collections_details(collection_id)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

@collections_details_bp.route('/collections_details/cancelled', methods=['POST'])
def cancel_collection():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "message": "Missing or invalid token"}), 401 
    
    data = request.get_json() 

    result = cancel_collection_by_id(data)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code
