import pyodbc
from app.models.db import get_db_connection_string
from firebase_admin import auth

def get_collections(userid):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor() 

        cursor.execute("SELECT 'col' + CAST(ColID AS VARCHAR) AS id, UserID, collection_date, collection_time, pickup_address, amount, number_items, weight, notes, status FROM Collections WHERE UserID = ?", userid)
        collections = cursor.fetchall()

        if not collections:
            return {"success": True, "message": "No collections found.", "collections": []}

        # Format collections into a list of dictionaries
        collections_list = []
        columns = [column[0] for column in cursor.description]

        for row in collections:
            collections_list.append(dict(zip(columns, row)))

        return {
            "success": True,
            "message": "Collections retrieved successfully.",
            "collections": collections_list
        }

    except pyodbc.Error as ex:
        return {"success": False, "message": f"Database error: {ex}"}
    except Exception as e:
        return {"success": False, "message": f"Unexpected error: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close() 
