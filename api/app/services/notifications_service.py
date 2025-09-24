import pyodbc 
from app.models.db import get_db_connection_string 

def get_notifications(user_id: int, firebase_uid: str) -> dict:
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        with pyodbc.connect(conn_str) as cnxn, cnxn.cursor() as cursor:
            query = """
                SELECT NotificationID, UserID, title, messages, type, isread, created_at, read_at
                FROM Notifications
                WHERE UserID = ?
            """
            cursor.execute(query, (user_id))
            rows = cursor.fetchall()

            # Convert rows into list of dictionaries
            columns = [col[0] for col in cursor.description]
            result = [dict(zip(columns, row)) for row in rows] or None

        return {
            "success": True,
            "message": "Notifications retrieved successfully." if result else "No records found.",
            "result": result,
        }

    except pyodbc.Error as ex:
        return {
            "success": False,
            "message": f"Database error: {ex.args[0]} - {ex.args[1]}",
            "result": None,
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"An unexpected error occurred: {e}",
            "result": None,
        }
    
def markasread_notifications(user_id: int, notif_id: int) -> dict:
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error.", "result": None}

    try:
        with pyodbc.connect(conn_str) as cnxn, cnxn.cursor() as cursor:  

            if notif_id == 0:

                update_query = """
                    UPDATE Notifications SET isread = 1  
                    WHERE UserID = ?
                """
                cursor.execute(update_query, (user_id)) 

            else:

                update_query = """
                    UPDATE Notifications SET isread = 1  
                    WHERE NotificationID = ? AND UserID = ?
                """
                cursor.execute(update_query, (notif_id, user_id)) 

            cursor.commit()

            return {"success": True, "message": "Notifications mark as read successfully"}

    except pyodbc.Error as ex:
        return {
            "success": False,
            "message": f"Database error: {ex.args[0]} - {ex.args[1]}",
            "result": None,
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"An unexpected error occurred: {e}",
            "result": None,
        }

def create_notifications(user_id: int, data: dict) -> dict:
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error.", "result": None}

    title = data.get("title")
    type = data.get("type")
    message = data.get("message") 
 
    try:
        with pyodbc.connect(conn_str) as cnxn, cnxn.cursor() as cursor:  
 
                insert_query = """
                    INSERT INTO Notifications (UserID, title, messages, type, isread, created_at, read_at) 
                    OUTPUT INSERTED.UserID, INSERTED.title,
                        INSERTED.messages, INSERTED.type, INSERTED.isread, INSERTED.created_at, INSERTED.read_at
                    VALUES (?, ?, ?, ?, ?, GETDATE(), NULL)
                """
                cursor.execute(insert_query, (user_id, title, message, type, 0))

                row = cursor.fetchone()
                columns = [col[0] for col in cursor.description]
                result = dict(zip(columns, row)) if row else None

                cnxn.commit()

        if result:
            return {
                "success": True,
                "message": "Notifications saved successfully.",
                "result": result
            } 

    except pyodbc.Error as ex:
        return {
            "success": False,
            "message": f"Database error: {ex.args[0]} - {ex.args[1]}",
            "result": None,
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"An unexpected error occurred: {e}",
            "result": None,
        }
    
def savefcmtoken_notifications(user_id: int, data: dict) -> dict:
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error.", "result": None}

    fcm_token = data.get("fcm_token") 
 
    try:
        with pyodbc.connect(conn_str) as cnxn, cnxn.cursor() as cursor:  
 
                cursor.execute("""
                    IF EXISTS (SELECT 1 FROM UserTokens WHERE UserID = ? AND fcm_token = ?)
                        UPDATE UserTokens SET updated_at = GETDATE()
                        WHERE UserID = ? AND fcm_token = ?
                    ELSE
                        INSERT INTO UserTokens (UserID, fcm_token) VALUES (?, ?)
                    """, (user_id, fcm_token, user_id, fcm_token, user_id, fcm_token))
                
                cnxn.commit()
                cnxn.close()

                return {"success": True, "message": "FCM token saved"}

    except pyodbc.Error as ex:
        return {
            "success": False,
            "message": f"Database error: {ex.args[0]} - {ex.args[1]}",
            "result": None,
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"An unexpected error occurred: {e}",
            "result": None,
        }