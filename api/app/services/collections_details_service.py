import pyodbc
from app.models.db import get_db_connection_string

def get_collections_details(collection_id):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor() 

        query = """
        SELECT 
            'col' + CAST(ColID AS VARCHAR) AS id, UserID, collection_date, collection_time, pickup_address,
            number_items, weight, notes, status
        FROM Collections
        WHERE ColID = ? 
        """
        cursor.execute(query, (collection_id,))
        row = cursor.fetchone()

        if not row:
            return {"success": False, "message": "Collection not found."}

        # Format collections into a list of dictionaries
        columns = [column[0] for column in cursor.description]
        collection = dict(zip(columns, row))

        result = {
            "id": collection["id"],
            "collection_date": collection["collection_date"],
            "collection_time": collection["collection_time"],
            "pickup_address": collection["pickup_address"],
            "status": collection["status"],
            "weight": collection["weight"],
            "number_items": collection["number_items"],
            "notes": collection["notes"],
            # "Collector": {
            #     "name": collection["CollectorName"],
            #     "phone": collection["CollectorPhone"],
            #     "rating": collection["CollectorRating"]
            # } if collection["CollectorName"] else None,
            # "PaymentStatus": collection["PaymentStatus"],
            # "PaymentAmount": collection["PaymentAmount"],
            # "PaymentMethod": collection["PaymentMethod"],
            # "PaymentDate": collection["PaymentDate"],
        }

        return {"success": True, "collection": result}

    except pyodbc.Error as ex:
        return {"success": False, "message": f"Database error: {ex}"}
    except Exception as e:
        return {"success": False, "message": f"Unexpected error: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close() 

def cancel_collection_by_id(data):
    conn_str = get_db_connection_string()
    if not conn_str:
        return False

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor()

        coldet_id = data.get("id")
        cancel_reason = data.get("reason")

        cursor.execute("""
            UPDATE Collections
            SET status = ?, reason = ?
            WHERE ColID = ? AND status IN ('scheduled', 'pending')
        """, ("cancelled", cancel_reason, coldet_id))

        cnxn.commit() 

        if cursor.rowcount > 0:
            return {"success": True, "message": "Collection cancelled successfully."}
        else:
            return {
                "success": False,
                "message": "Collection not cancelled. It may not exist or is already completed/cancelled."
            }
    
    except pyodbc.Error as ex:
        print(f"Database error while cancelling collection: {ex}")
        return False
    except Exception as e:
        print(f"Unexpected error while cancelling collection: {e}")
        return False
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close()

