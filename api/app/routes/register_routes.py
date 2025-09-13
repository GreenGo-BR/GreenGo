from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import jwt
# from app.services.register_service import add_register
from app.config import Config 

secret_key = Config.SECRET_KEY

register_bp = Blueprint('register', __name__)

@register_bp.route('/register', methods=['POST'])
def register_user():     
    
    """  name = request.form.get("name")
    email = request.form.get("email")
    cpf = request.form.get("cpf")
    country = request.form.get("country")
    password = request.form.get("password")  """

    # Get file from form data
    # avatar_file = request.files.get("avatar") 

    print("asd")

    # Build data dictionary for your internal logic
    """  data = {
        "name": name,
        "email": email,
        "cpf": cpf,
        "country": country,
        "password": password, 
        "avatar_filename": avatar_file.filename if avatar_file else None,
    }  """

    """ result = add_register(data)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code """