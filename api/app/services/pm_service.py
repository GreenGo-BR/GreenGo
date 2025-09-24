import pyodbc 
from app.models.db import get_db_connection_string 

def get_pm(user_id: int, firebase_uid: str) -> dict:
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        with pyodbc.connect(conn_str) as cnxn, cnxn.cursor() as cursor:
            query = """
                SELECT PmID, UserID, firebase_uid, type, keyname, label, isdefault
                FROM PaymentMethod
                WHERE UserID = ? AND firebase_uid = ?
            """
            cursor.execute(query, (user_id, firebase_uid))
            rows = cursor.fetchall()

            # Convert rows into list of dictionaries
            columns = [col[0] for col in cursor.description]
            result = [dict(zip(columns, row)) for row in rows] or None

        return {
            "success": True,
            "message": "Payment methods retrieved successfully." if result else "No records found.",
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
    
def create_pm(user_id: int, firebase_uid: str, data: dict) -> dict:
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error.", "result": None}

    required_fields = ["type", "key"]
    missing = [f for f in required_fields if f not in data or not data[f]]
    if missing:
        return {
            "success": False,
            "message": f"Missing required fields: {', '.join(missing)}",
            "result": None,
        }

    pm_id_raw = data.get("id")
    pm_type = data.get("type")
    pm_key = data.get("key")
    pm_label = data.get("label")
    is_default = data.get("isDefault", False)
    is_default = 1 if is_default else 0 
    pm_id = int(pm_id_raw) if pm_id_raw not in (None, "", "null") else 0
 
    try:
        with pyodbc.connect(conn_str) as cnxn, cnxn.cursor() as cursor:  
 
            if pm_id > 0:  
 
                update_query = """
                    UPDATE PaymentMethod
                    SET type = ?, keyname = ?, label = ?, isdefault = ?
                    OUTPUT INSERTED.PmID, INSERTED.UserID, INSERTED.firebase_uid,
                        INSERTED.type, INSERTED.keyname, INSERTED.label, INSERTED.isdefault
                    WHERE PmID = ? AND UserID = ? AND firebase_uid = ?
                """
                cursor.execute(update_query, (pm_type, pm_key, pm_label, is_default, pm_id, user_id, firebase_uid))
                row = cursor.fetchone()
                columns = [col[0] for col in cursor.description]
                result = dict(zip(columns, row)) if row else None

            else: 
                insert_query = """
                    INSERT INTO PaymentMethod (UserID, firebase_uid, type, keyname, label, isdefault) 
                    OUTPUT INSERTED.PmID, INSERTED.UserID, INSERTED.firebase_uid,
                        INSERTED.type, INSERTED.keyname, INSERTED.label, INSERTED.isdefault
                    VALUES (?, ?, ?, ?, ?, ?)
                """
                cursor.execute(insert_query, (user_id, firebase_uid, pm_type, pm_key, pm_label, is_default))

                row = cursor.fetchone()
                columns = [col[0] for col in cursor.description]
                result = dict(zip(columns, row)) if row else None

                cnxn.commit()

        if result:
            return {
                "success": True,
                "message": "Payment method saved successfully.",
                "result": result
            }
        else:
            return {
                "success": False,
                "message": "No payment method found to update." if pm_id else "Insert failed.",
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
    
def delete_pm(user_id: int, firebase_uid: str, pm_id: int) -> dict:
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error.", "result": None}
 
    try:
        with pyodbc.connect(conn_str) as cnxn, cnxn.cursor() as cursor:  
 
            check_query = """
                SELECT isdefault 
                FROM PaymentMethod 
                WHERE PmID = ? AND UserID = ? AND firebase_uid = ?
            """
            cursor.execute(check_query, (pm_id, user_id, firebase_uid))
            row = cursor.fetchone()

            if not row:
                return {"success": False, "message": "Payment method not found"}

            if row[0] == 1:
                return {"success": False, "message": "Cannot delete default payment method"}
            
            delete_query = """
                DELETE FROM PaymentMethod 
                WHERE PmID = ? AND UserID = ? AND firebase_uid = ?
            """
            cursor.execute(delete_query, (pm_id, user_id, firebase_uid))
            cnxn.commit()

            return {"success": True, "message": "Payment method deleted successfully"}

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
    
def default_pm(user_id: int, firebase_uid: str, pm_id: int) -> dict:
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error.", "result": None}
 
    try:
        with pyodbc.connect(conn_str) as cnxn, cnxn.cursor() as cursor:  
 
            update_query = """
                UPDATE PaymentMethod
                SET isdefault = 1
                OUTPUT INSERTED.PmID, INSERTED.UserID, INSERTED.firebase_uid,
                    INSERTED.type, INSERTED.keyname, INSERTED.label, INSERTED.isdefault
                WHERE PmID = ? AND UserID = ? AND firebase_uid = ?
            """
            cursor.execute(update_query, (pm_id, user_id, firebase_uid))
            row = cursor.fetchone()
            columns = [col[0] for col in cursor.description]
            result = dict(zip(columns, row)) if row else None

            cnxn.commit()
            return {"success": True, "message": "Default updated", "result": result}

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
