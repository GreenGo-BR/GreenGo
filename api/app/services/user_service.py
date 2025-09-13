import pyodbc
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
