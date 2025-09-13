from dotenv import load_dotenv
import sys
import os

def get_db_connection_string():
    try: 
        
        load_dotenv(dotenv_path=os.path.join(os.getcwd(), '.env')) 

        server = os.getenv('DB_SERVER')
        database = os.getenv('DB_NAME')
        username = os.getenv('DB_USER')
        password = os.getenv('DB_PASSWORD')
        driver = os.getenv('DB_DRIVER')

        if not all([server, database, username, password, driver]):
            raise ValueError("Missing one or more database environment variables.")

        return f"DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}"

    except Exception as e:
        print(f"Error loading DB config: {e}", file=sys.stderr)
        return None
