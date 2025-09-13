import pyodbc 
from app.models.db import get_db_connection_string

def schedule_collections(data):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor()

        user_id = data.get("userid")
        id = int(data.get("id", 0))
        date = data.get("date")
        time_slot = data.get("timeSlot")
        address = data.get("address")
        cans_count = data.get("cansCount")
        notes = data.get("notes")
        weight = round(int(cans_count) / 60, 2)
        status = "scheduled" 
        if id == 0:  
            delete_query = """
            DELETE FROM Collections
            WHERE UserID = ? AND PickupAddress = ? AND CAST(CollectionDate AS DATE) = CAST(? AS DATE)
            """
            cursor.execute(delete_query, (user_id, address, date))

            # 📝 INSERT new collection
            insert_query = """
            INSERT INTO Collections (UserID, CollectionDate, CollectionTime, PickupAddress, NumberOfItems, Weight, Status, Notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """
            cursor.execute(insert_query, (user_id, date, time_slot, address, cans_count, weight, status, notes))
            
        else: 
    
            update_query = """
                UPDATE Collections
                SET UserID = ?, CollectionDate = ?, CollectionTime = ?, PickupAddress = ?, 
                    NumberOfItems = ?, Weight = ?, Status = ?, Notes = ?
                WHERE ColID = ?
            """
            cursor.execute(update_query, (user_id, date, time_slot, address, cans_count, weight, status, notes, id))
        
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