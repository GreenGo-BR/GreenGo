import pyodbc
from flask import jsonify, request
from app.models.db import get_db_connection_string


def get_all_users():
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor() 

        cursor.execute("SELECT UserID, Name, Email, CPF, Country FROM Users WHERE Deleted = 0")
        users = cursor.fetchall()

        if not users:
            return {"success": True, "message": "No users found.", "users": []}

        # Format users into a list of dictionaries
        user_list = []
        columns = [column[0] for column in cursor.description]

        for row in users:
            user_list.append(dict(zip(columns, row)))

        return {
            "success": True,
            "message": "Users retrieved successfully.",
            "users": user_list
        }

    except pyodbc.Error as ex:
        return {"success": False, "message": f"Database error: {ex}"}
    except Exception as e:
        return {"success": False, "message": f"Unexpected error: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close()

def get_user_id_by_firebase_uid(uid: str): 
    conn_str = get_db_connection_string()
    with pyodbc.connect(conn_str) as cnxn, cnxn.cursor() as cursor:
        cursor.execute("SELECT UserID FROM Users WHERE firebase_uid = ?", (uid,))
        row = cursor.fetchone()
        return row[0] if row else None
    
def get_user_fcm_token_by_user_id(userid: str): 
    conn_str = get_db_connection_string()
    with pyodbc.connect(conn_str) as cnxn, cnxn.cursor() as cursor:
        cursor.execute("SELECT fcm_token FROM UserTokens WHERE UserID = ?", (userid,))
        row = cursor.fetchall()
        return row[0] if row else None
