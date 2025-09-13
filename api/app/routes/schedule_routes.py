from flask import Blueprint, request, jsonify
import jwt
from app.services.schedule_service import schedule_collections
from app.config import Config

secret_key = Config.SECRET_KEY

schedule_bp = Blueprint('schedule', __name__)

@schedule_bp.route('/schedule', methods=['POST'])
def schedule():    
    
    data = request.get_json()   
    result = schedule_collections(data)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code