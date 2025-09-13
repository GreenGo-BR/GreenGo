import pyodbc 
from app.models.db import get_db_connection_string
from passlib.hash import bcrypt

def add_register(data):
    conn_str = get_db_connection_string()
    if not conn_str:
        return {"success": False, "message": "Database configuration error."}

    try:
        cnxn = pyodbc.connect(conn_str)
        cursor = cnxn.cursor()


        print(data.get())

        # name = data.get("name")
        # email = data.get("email")
        # cpf = data.get("cpf")
        # country = data.get("country")
        # password = data.get("password") 

        # cursor.execute("SELECT Name, Email, CPF, Country, ProfileImage FROM Users WHERE Name = ? AND Email = ?", name)
        # profile = cursor.fetchone()
                    
        # cnxn.commit()

        # return {
        #     "success": True, 
        #     "profile": {
        #         "name" : profile.Name,
        #         "email" : profile.Email,
        #         "cpf" : profile.CPF,
        #         "country" : profile.Country,
        #         "avatar" : profile.ProfileImage
        #     }
        # }
       
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        return {"success": False, "message": f"Database error: {sqlstate} - {ex.args[1]}"}
    except Exception as e:
        return {"success": False, "message": f"An unexpected error occurred: {e}"}
    finally:
        if 'cnxn' in locals() and cnxn:
            cnxn.close()

# def edit_profile(data):
#     conn_str = get_db_connection_string()
#     if not conn_str:
#         return {"success": False, "message": "Database configuration error."}

#     try:
#         cnxn = pyodbc.connect(conn_str)
#         cursor = cnxn.cursor()

#         id = data.get("id")
#         name = data.get("name")
#         email = data.get("email")
#         cpf = data.get("cpf")
#         country = data.get("country")

#         cursor.execute("""
#             UPDATE Users
#             SET Name = ?, Email = ?, CPF = ?, Country = ? 
#             WHERE UserID = ?
#         """, (name, email, cpf, country, id))
                    
#         cnxn.commit()

#         return {
#             "success": True, "message" : "Update Profile Successful"
#         }
       
#     except pyodbc.Error as ex:
#         sqlstate = ex.args[0]
#         return {"success": False, "message": f"Database error: {sqlstate} - {ex.args[1]}"}
#     except Exception as e:
#         return {"success": False, "message": f"An unexpected error occurred: {e}"}
#     finally:
#         if 'cnxn' in locals() and cnxn:
#             cnxn.close()
            
# def upload_profile(user_id, avatar_url):
#     conn_str = get_db_connection_string()
#     if not conn_str:
#         return {"success": False, "message": "Database configuration error."} 

#     try:
#         cnxn = pyodbc.connect(conn_str)
#         cursor = cnxn.cursor() 

#         cursor.execute("""
#             UPDATE Users
#             SET ProfileImage = ?
#             WHERE UserID = ?
#         """, (avatar_url, user_id))

#         cnxn.commit()

#         return {
#             "success": True,
#             "avatarUrl": avatar_url,
#             "message": "Avatar updated successfully."
#         }
       
#     except pyodbc.Error as ex:
#         sqlstate = ex.args[0]
#         return {"success": False, "message": f"Database error: {sqlstate} - {ex.args[1]}"}
#     except Exception as e:
#         return {"success": False, "message": f"An unexpected error occurred: {e}"}
#     finally:
#         if 'cnxn' in locals() and cnxn:
#             cnxn.close()

# def changepassword_profile(data):
#     conn_str = get_db_connection_string()
#     if not conn_str:
#         return {"success": False, "message": "Database configuration error."}

#     try:
#         cnxn = pyodbc.connect(conn_str)
#         cursor = cnxn.cursor()

#         id = data.get("userId")
#         newpass = data.get("newpass")  

#         hashed_pass = bcrypt.hash(newpass)

#         cursor.execute("""
#             UPDATE Users
#             SET Password = ?
#             WHERE UserID = ?
#         """, (hashed_pass, id))
                    
#         cnxn.commit()

#         return {
#             "success": True, "message" : "Update Password Successful"
#         }
       
#     except pyodbc.Error as ex:
#         sqlstate = ex.args[0]
#         return {"success": False, "message": f"Database error: {sqlstate} - {ex.args[1]}"}
#     except Exception as e:
#         return {"success": False, "message": f"An unexpected error occurred: {e}"}
#     finally:
#         if 'cnxn' in locals() and cnxn:
#             cnxn.close()