import pyodbc
import io
import pyotp
import qrcode
import base64
from app.models.db import get_db_connection_string
from passlib.hash import bcrypt

def get_profile(user_id):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor() 

        cursor.execute("SELECT Name, Email, CPF, Country, ProfileImage FROM Users WHERE UserID = ?", user_id)
        profile = cursor.fetchone()
                    
        cnxn.commit()

        return {
            "success": True, 
            "profile": {
                "name" : profile.Name,
                "email" : profile.Email,
                "cpf" : profile.CPF,
                "country" : profile.Country,
                "avatar" : profile.ProfileImage
            }
        }
       
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        return {"success": False, "message": f"Database error: {sqlstate} - {ex.args[1]}"}
    except Exception as e:
        return {"success": False, "message": f"An unexpected error occurred: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close()

def edit_profile(data):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor()

        id = data.get("id")
        name = data.get("name")
        email = data.get("email")
        cpf = data.get("cpf")
        country = data.get("country")

        cursor.execute("""
            UPDATE Users
            SET Name = ?, Email = ?, CPF = ?, Country = ? 
            WHERE UserID = ?
        """, (name, email, cpf, country, id))
                    
        cnxn.commit()

        return {
            "success": True, "message" : "Update Profile Successful"
        }
       
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        return {"success": False, "message": f"Database error: {sqlstate} - {ex.args[1]}"}
    except Exception as e:
        return {"success": False, "message": f"An unexpected error occurred: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close()
            
def upload_profile(user_id, avatar_url):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."} 

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor() 

        cursor.execute("""
            UPDATE Users
            SET ProfileImage = ?
            WHERE UserID = ?
        """, (avatar_url, user_id))

        cnxn.commit()

        return {
            "success": True,
            "avatarUrl": avatar_url,
            "message": "Avatar updated successfully."
        }
       
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        return {"success": False, "message": f"Database error: {sqlstate} - {ex.args[1]}"}
    except Exception as e:
        return {"success": False, "message": f"An unexpected error occurred: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close()

def changepassword_profile(data):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor()

        id = data.get("userId")
        newpass = data.get("newpass")  

        hashed_pass = bcrypt.hash(newpass)

        cursor.execute("""
            UPDATE Users
            SET Password = ?
            WHERE UserID = ?
        """, (hashed_pass, id))
                    
        cnxn.commit()

        return {
            "success": True, "message" : "Update Password Successful"
        }
       
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        return {"success": False, "message": f"Database error: {sqlstate} - {ex.args[1]}"}
    except Exception as e:
        return {"success": False, "message": f"An unexpected error occurred: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close()

def language_profile(data):

    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor()

        id = data.get("id")
        lang = data.get("lang")

        cursor.execute("""
            UPDATE Users
            SET language = ?
            WHERE UserID = ?
        """, (lang, id))
                    
        cnxn.commit()

        return {
            "success": True, "message" : "Update language Successful"
        } 
       
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        return {"success": False, "message": f"Database error: {sqlstate} - {ex.args[1]}"}
    except Exception as e:
        return {"success": False, "message": f"An unexpected error occurred: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close()

def two_factor_profile(data):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor() 

        user_id = data.get("userId") 
        action = data.get("action") 
        
        if action == "generate":

            user = get_user_by_id(cursor, user_id)
            secret = user.get("twofa_secret")

            if not secret:
                secret = pyotp.random_base32()
                update_user_2fa_secret(cursor, user_id, secret)
                cnxn.commit() 

            totp = pyotp.TOTP(secret)
            otpauth_url = totp.provisioning_uri(name=f"user{user_id}", issuer_name="GreenGo")

            qr = qrcode.make(otpauth_url)
            buffered = io.BytesIO()
            qr.save(buffered, format="PNG")
            qr_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

            return {
                "success": True,
                "message" : "Generate Qrcode Successful",
                "qrCode": f"data:image/png;base64,{qr_base64}",
                "secret": secret 
            } 
        elif action == "verify":
            code = data.get("code")
            user = get_user_by_id(cursor, user_id)
            
            secret = user.get("twofa_secret")

            if not secret:
                return {"success": False, "message": "2FA not initiated"}
            totp = pyotp.TOTP(secret)  
           
            if totp.verify(code, valid_window=1):
                enable_user_2fa(cursor, user_id)
                cnxn.commit()
                return {"success": True, "message": "2FA enabled"}
            else:
                return {"success": False, "message": "Invalid code"}
            
        else:
            return {"success": False, "message": "Invalid action"}
       
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        return {"success": False, "message": f"Database error: {sqlstate} - {ex.args[1]}"}
    except Exception as e:
        return {"success": False, "message": f"An unexpected error occurred: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close()

def update_user_2fa_secret(cursor, user_id, secret):
    cursor.execute("UPDATE Users SET twofa_secret = ? WHERE UserID = ?", (secret, user_id))

def enable_user_2fa(cursor, user_id): 
    cursor.execute("UPDATE Users SET twofa_enabled = 1 WHERE UserID = ?", (user_id,))

def get_user_by_id(cursor, user_id):
    cursor.execute("SELECT twofa_secret, twofa_enabled FROM Users WHERE UserID = ?", (user_id,))
    row = cursor.fetchone()
    if row:
        columns = [column[0] for column in cursor.description]
        return dict(zip(columns, row))
    return None

def twofa_status_profile(data):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor() 

        user_id = data.get("userId")

        user = get_user_by_id(cursor, user_id)
        
        twoenabled = user.get('twofa_enabled') 
 
        if not user:
            return {"success": False, "message": "User not found"}
        
        if twoenabled == 1: 
            return {"success": True, "enabled": bool(True)}
        else:
            return {"success": True, "enabled": bool(False)}
       
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        return {"success": False, "message": f"Database error: {sqlstate} - {ex.args[1]}"}
    except Exception as e:
        return {"success": False, "message": f"An unexpected error occurred: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close()