import pyodbc
import io
import pyotp
import qrcode
import base64
from app.models.db import get_db_connection_string
from passlib.hash import bcrypt

def get_profile(uid):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor() 

        cursor.execute("SELECT name, email, cpf, country, avatar, phone_number, notifications, darkmode FROM Users WHERE firebase_uid = ?", uid)
        profile = cursor.fetchone()
                    
        cnxn.commit()

        return {
            "success": True, 
            "profile": {
                "name" : profile.name,
                "email" : profile.email,
                "phone" : profile.phone_number,
                "cpf" : profile.cpf,
                "country" : profile.country,
                "avatar" : profile.avatar,
                "notif" : profile.notifications,
                "darkmode" : profile.darkmode
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
            
def upload_profile(uid, avatar_url):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."} 

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor() 

        cursor.execute("""
            UPDATE Users
            SET avatar = ?
            WHERE firebase_uid = ?
        """, (avatar_url, uid))

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

def two_factor_profile(data, uid):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor() 
 
        action = data.get("action") 
        
        if action == "generate":

            user = get_user_by_id(cursor, uid)
            secret = user.get("twofa_secret")

            if not secret:
                secret = pyotp.random_base32()
                update_user_2fa_secret(cursor, uid, secret)
                cnxn.commit() 

            totp = pyotp.TOTP(secret)
            otpauth_url = totp.provisioning_uri(issuer_name="GreenGo")

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
            user = get_user_by_id(cursor, uid)
            
            secret = user.get("twofa_secret")

            if not secret:
                return {"success": False, "message": "2FA not initiated"}
            totp = pyotp.TOTP(secret)  
           
            if totp.verify(code, valid_window=1):
                enable_user_2fa(cursor, uid)
                cnxn.commit()
                return {"success": True, "message": "2FA enabled"}
            else:
                return {"success": False, "message": "Invalid code"}
        elif action == "disabled":

            if uid:
                disabled_user_2fa(cursor, uid)
                cnxn.commit()
                return {"success": True, "message": "2FA disabled"}
            else:
                return {"success": False, "message": "Invalid user id"}
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

def update_user_2fa_secret(cursor, uid, secret):
    cursor.execute("UPDATE Users SET twofa_secret = ? WHERE firebase_uid = ?", (secret, uid))

def enable_user_2fa(cursor, uid): 
    cursor.execute("UPDATE Users SET twofa_enabled = 1 WHERE firebase_uid = ?", (uid,))

def disabled_user_2fa(cursor, uid): 
    cursor.execute("UPDATE Users SET twofa_enabled = 0, twofa_secret = NULL WHERE firebase_uid = ?", (uid,))

def get_user_by_id(cursor, uid):
    cursor.execute("SELECT twofa_secret, twofa_enabled FROM Users WHERE firebase_uid = ?", (uid,))
    row = cursor.fetchone()
    if row:
        columns = [column[0] for column in cursor.description]
        return dict(zip(columns, row))
    return None

def twofa_status_profile(uid):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor()  

        user = get_user_by_id(cursor, uid)
        
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

""" notifications """
def notif_profile(data, uid):

    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor()
 
        notif = data.get("notif")

        cursor.execute("""
            UPDATE Users
            SET notifications = ?
            WHERE firebase_uid = ?
        """, (notif, uid))
                    
        cnxn.commit()

        return {
            "success": True, "message" : "Update notification successful"
        } 
       
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        return {"success": False, "message": f"Database error: {sqlstate} - {ex.args[1]}"}
    except Exception as e:
        return {"success": False, "message": f"An unexpected error occurred: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close()

def darkmode_profile(data, uid):

    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor()
 
        darkmode = data.get("darkmode") 

        cursor.execute("""
            UPDATE Users
            SET darkmode = ?
            WHERE firebase_uid = ?
        """, (darkmode, uid))
                    
        cnxn.commit()

        return {
            "success": True, "message" : "Update notification successful"
        } 
       
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        return {"success": False, "message": f"Database error: {sqlstate} - {ex.args[1]}"}
    except Exception as e:
        return {"success": False, "message": f"An unexpected error occurred: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close()