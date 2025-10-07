import pyodbc 
import jwt
import datetime
import os
import pyotp
from werkzeug.utils import secure_filename
from app.models.db import get_db_connection_string
from app.config import Config 
from firebase_admin import auth
from flask import jsonify, request

secret_key = Config.SECRET_KEY

def authenticate_user(user_id: int, firebase_uid: str) -> dict:
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        with pyodbc.connect(conn_str) as cnxn, cnxn.cursor() as cursor:  
            query = "SELECT UserID, firebase_uid, email, twofa_enabled, twofa_secret FROM Users WHERE firebase_uid = ?"
            cursor.execute(query, (firebase_uid,)) 
            rows = cursor.fetchone()

            if not rows:
                return {
                    "success": True, 
                    "message": "User not registered in system.", 
                    "result": None
                }
            
            columns = [col[0] for col in cursor.description]
            result = dict(zip(columns, rows))
            
            user_id = result["UserID"]
            twofa_enabled = result["twofa_enabled"]
            
            if twofa_enabled == 1:
                temp_token = generate_token(
                    {"userId": user_id, "type": "2fa"}, 
                    custom_expiry=datetime.timedelta(minutes=5)
                )
                return {
                    "success": True,
                    "message": "2FA required.",
                    "twofa_required": True,
                    "temp_token": temp_token
                } 
        return {
            "success": True,
            "message": "Authentication successful.",
            "result" : result,
            
        }  

    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        return {"success": False, "message": f"Database error: {sqlstate} - {ex.args[1]}"}
    except Exception as e:
        return {"success": False, "message": f"An unexpected error occurred: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close()

def generate_token(payload, remember_me=False, custom_expiry=None):
    if custom_expiry:
        expiration = custom_expiry
    else:
        expiration = datetime.timedelta(days=1) if remember_me else datetime.timedelta(hours=2)

    return jwt.encode(
        {
            **payload,
            "exp": datetime.datetime.utcnow() + expiration
        },
        secret_key,
        algorithm="HS256"
    )

def register_user(data):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor()
 
        firebase_uid = data.get("firebase_uid")
        name = data.get("name")
        email = data.get("email")
        cpf = data.get("cpf")
        country = data.get("country") 
        profile_image = data.get("avatar_filename")  

        cursor.execute("SELECT COUNT(*) FROM Users WHERE email = ?", (email,))
        if cursor.fetchone()[0] > 0:
            return {"success": False, "message": "Email already registered."}

        insert_query = """
        INSERT INTO Users (firebase_uid, name, email, cpf, country)
        OUTPUT INSERTED.UserID
        VALUES (?, ?, ?, ?, ?)
        """
        cursor.execute(
            insert_query,
            (firebase_uid, name, email, cpf, country)
        )

        user_id = cursor.fetchone()[0]

        if profile_image and profile_image.filename:

            basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../'))
            upload_folder = os.path.join(basedir, 'public', 'avatars')
            os.makedirs(upload_folder, exist_ok=True)
            
            filename = f"avatar-{user_id}-{secure_filename(profile_image.filename)}"
            file_path = os.path.join(upload_folder, filename)
            profile_image.save(file_path)

            avatar_url = f"/avatars/{filename}"

            update_query = "UPDATE Users SET avatar = ? WHERE UserID = ?"
            cursor.execute(
                update_query,
                (avatar_url, user_id)
            )

        cnxn.commit()

        return {
            "success": True,
            "message": "User registered successfully."
        }

    except pyodbc.Error as ex:
        return {"success": False, "message": f"Database error: {ex}"}
    except Exception as e:
        return {"success": False, "message": f"Unexpected error: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close() 

def twofa_user(data):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    code = data.get("code")
    temp_token = data.get("temp_token")

    if not code or not temp_token:
        return {"success": False, "message": "Missing 2FA code or token."}

    try: 
        decoded = jwt.decode(temp_token, secret_key, algorithms=["HS256"])

        if decoded.get("type") != "2fa":
            return {"success": False, "message": "Invalid token type."}

        user_id = decoded.get("userId")
        email = decoded.get("email")

        # Connect to DB
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor()

        # Get 2FA secret for the user
        cursor.execute("SELECT twofa_secret FROM Users WHERE UserID = ?", (user_id,))
        row = cursor.fetchone()
        if not row:
            return {"success": False, "message": "User not found."}

        twofa_secret = row[0]

        # Verify the code using pyotp
        totp = pyotp.TOTP(twofa_secret)
        if not totp.verify(code):
            return {"success": False, "message": "Invalid 2FA code."}

        # Generate final auth token (no temp_token, full access)
        token = generate_token({"userId": user_id, "email": email})

        return {
            "success": True,
            "message": "2FA verified successfully.",
            # "token": token
        }

    except jwt.ExpiredSignatureError:
        return {"success": False, "message": "2FA token expired."}
    except jwt.InvalidTokenError:
        return {"success": False, "message": "Invalid token."}
    except pyodbc.Error as ex:
        return {"success": False, "message": f"Database error: {ex}"}
    except Exception as e:
        return {"success": False, "message": f"Unexpected error: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close()

def get_firebase_uid(): 
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None, jsonify({"success": False, "message": "Missing or invalid token"}), 401

    id_token = auth_header.split(" ")[1]

    try:
        decoded = auth.verify_id_token(id_token)
        return decoded["uid"], None, None
    except Exception as e:
        return None, jsonify({"success": False, "message": f"Token verification failed: {e}"}), 401
