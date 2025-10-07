import firebase_admin
import os
from firebase_admin import credentials

def init_firebase():
    # Only initialize once
    if not firebase_admin._apps:
        cred_path = os.getenv("FIREBASE_CREDENTIALS")
        cred = credentials.Certificate(cred_path) 
        firebase_admin.initialize_app(cred)
            
