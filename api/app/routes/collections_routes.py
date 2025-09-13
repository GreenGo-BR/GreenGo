from flask import Blueprint, request, jsonify
import jwt
from app.services.collections_service import get_collections
from app.config import Config

secret_key = Config.SECRET_KEY

collections_bp = Blueprint('collections', __name__)

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

@collections_bp.route('/collections', methods=['GET'])
def collections():
    auth_header = request.headers.get("Authorization") 
    user = decode_token(auth_header)

    if not user:
        return jsonify({"success": False, "message": "Unauthorized"}), 401
     
    userID = user.get("userId") 

    result = get_collections(userID)
    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code