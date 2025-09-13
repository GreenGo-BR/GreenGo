import pyodbc 
from app.models.db import get_db_connection_string 

def check_db_connection():
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor()
 
        query = "SELECT 1"
        cursor.execute(query) 
        result = cursor.fetchone() 

        return {
            "success": True,
            "message": "Database connection successful.",
            "result": result[0] if result else None
        }

    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        return {"success": False, "message": f"Database error: {sqlstate} - {ex.args[1]}"}
    except Exception as e:
        return {"success": False, "message": f"An unexpected error occurred: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close()