import pyodbc 
from app.models.db import get_db_connection_string

def schedule_collections(data, userid):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor()
 
        id = int(data.get("id", 0))
        date = data.get("date")
        time_slot = data.get("timeSlot")
        address = data.get("address")
        cans_count = data.get("cansCount")
        notes = data.get("notes")
        weight = round(int(cans_count) / 60, 2)
        status = "scheduled" 
        if id == 0: 
            insert_query = """
            INSERT INTO Collections (UserID, collection_date, collection_time, pickup_address, number_items, weight, status, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """
            cursor.execute(insert_query, (userid, date, time_slot, address, cans_count, weight, status, notes))
            
        else: 
    
            update_query = """
                UPDATE Collections
                SET UserID = ?, collection_date = ?, collection_time = ?, pickup_address = ?, 
                    number_items = ?, weight = ?, status = ?, notes = ?
                WHERE ColID = ?
            """
            cursor.execute(update_query, (userid, date, time_slot, address, cans_count, weight, status, notes, id))
        
        cnxn.commit()

        return {
            "success": True,
            "message": "Scheduled Collection successfully",
            "data": {
                "id" : id,
                "date": date,
                "timeSlot": time_slot,
                "address": address,
                "cansCount": cans_count,
                "notes": notes
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