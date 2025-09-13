import pyodbc 
import base64
import jwt
import datetime
import os
import smtplib
from app.models.db import get_db_connection_string
from app.config import Config
from passlib.hash import bcrypt
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

secret_key = Config.SECRET_KEY

def reset_password(email):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor() 

        

        cursor.execute("SELECT UserID, Name FROM Users WHERE Email = ?", (email,))
        user = cursor.fetchone() 

        if not user:
            return {"success": False, "message": "User not found"}
        
        user_id, user_name = user.UserID, user.Name

        payload = {
            "userId": user_id,
            "type": "password_reset", 
        }

        token = generate_token(payload)


        reset_url = f"http://localhost:3000/reset-password/new?token={token}"

        sentemail = send_email(
            to=email,
            subject="Reset your GreenGo password",
            body=f"Hi {user_name},\n\nClick the link below to reset your password:\n{reset_url}\n\nThis link expires in 1 hour."
        ) 
 
        if sentemail:
            return {"success": True}
        else:
            return {"success": False, "message": "Failed to send email."}
       
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        return {"success": False, "message": f"Database error: {sqlstate} - {ex.args[1]}"}
    except Exception as e:
        return {"success": False, "message": f"An unexpected error occurred: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close()

def set_new_password(data):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}
    
    token = data.get("token")
    password = data.get("password")
    
    try: 

        payload = jwt.decode(token, secret_key, algorithms=["HS256"])

        user_id = payload.get("userId")
        if not user_id:
            return {"success": False, "message": "Invalid token payload."}
        
    except jwt.ExpiredSignatureError:
        return {"success": False, "message": "Token expired."}
    except jwt.InvalidTokenError:
        return {"success": False, "message": "Invalid token."}
    
    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor() 

        hashed_pass = bcrypt.hash(password)

        cursor.execute("""
            UPDATE Users
            SET Password = ?
            WHERE UserID = ?
        """, (hashed_pass, user_id))
                    
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

def generate_token(payload):
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    return jwt.encode(
        {
            **payload,
            "exp": expiration
        },
        secret_key,
        algorithm="HS256"
    )

def send_email(to, subject, body):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "temporaryml222@gmail.com"
    sender_password = "zvnt btxg kgvj fhwt"

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to
    msg['Subject'] = subject


    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.set_debuglevel(1)
        server.ehlo()
        server.starttls()  # Secure connection
        server.ehlo()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to, msg.as_string())
        server.quit()
        print(f"Email sent to {to}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

