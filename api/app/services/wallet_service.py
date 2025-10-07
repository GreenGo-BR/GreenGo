import pyodbc 
from app.models.db import get_db_connection_string

def get_walletstatement(user_id: int) -> dict:
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        with pyodbc.connect(conn_str) as cnxn, cnxn.cursor() as cursor:
            query = """
                SELECT 
                wt.TransactionID, 
                wt.WalletID, 
                tt.type_name, 
                wt.reference_code, 
                wt.amount, 
                wt.tran_status, 
                wt.transaction_date
                FROM WalletTransaction wt
                LEFT JOIN Wallet w ON w.WalletID = wt.WalletID
                LEFT JOIN TransactionType tt ON tt.TransactionTypeID = wt.TransactionTypeID
                WHERE w.UserID = ?
                ORDER BY wt.transaction_date DESC
            """
            cursor.execute(query, (user_id, ))
            rows = cursor.fetchall()

            # Convert rows into list of dictionaries
            columns = [col[0] for col in cursor.description]
            result = [dict(zip(columns, row)) for row in rows] or None

        return {
            "success": True,
            "message": "Wallet statement methods retrieved successfully." if result else "No records found.",
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
def get_wallethomedata(user_id: int) -> dict:
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        with pyodbc.connect(conn_str) as cnxn, cnxn.cursor() as cursor:
            query = """
                SELECT TOP 1
                    w.WalletID,
                    w.current_balance,
                    wt.amount AS last_payment_amount,
                    wt.transaction_date AS last_payment_date
                FROM Wallet w
                LEFT JOIN WalletTransaction wt 
                    ON wt.WalletID = w.WalletID
                    AND wt.TransactionTypeID = 1  -- Payment type
                WHERE w.UserID = ?
                ORDER BY wt.transaction_date DESC
            """
            cursor.execute(query, (user_id, ))
            rows = cursor.fetchone()

            if not rows:
                return {
                    "success": True,
                    "message": "No wallet found for this user.",
                    "result": None,
                }

            columns = [col[0] for col in cursor.description]
            result = dict(zip(columns, rows))

        return {
            "success": True,
            "message": "Wallet retrieved successfully." if result else "No records found.",
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
def get_walletaccountsummary(user_id: int) -> dict:
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        with pyodbc.connect(conn_str) as cnxn, cnxn.cursor() as cursor:
            query = """
                SELECT  
                w.WalletID,  
                w.current_balance, 
                w.total_income, 
                w.total_expense
                FROM Wallet w 
                WHERE w.UserID = ? 
            """
            cursor.execute(query, (user_id, ))
            rows = cursor.fetchone()

            if not rows:
                return {
                    "success": True,
                    "message": "No wallet found for this user.",
                    "result": None,
                }

            columns = [col[0] for col in cursor.description]
            result = dict(zip(columns, rows))

        return {
            "success": True,
            "message": "Wallet retrieved successfully." if result else "No records found.",
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