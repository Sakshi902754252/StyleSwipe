import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv
import logging

# Load environment variables from .env file
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)

# Initialize Firebase Admin SDK
try:
    cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    logging.info("Successfully connected to Firebase.")
except Exception as e:
    logging.error(f"Error initializing Firebase: {e}")
    raise

def fetch_media_from_firebase(user_id):
    try:
        user_ref = db.collection('users').document(user_id)
        user_data = user_ref.get().to_dict()
        if user_data:
            logging.info(f"Fetched media for user {user_id}: {user_data.get('media', [])}")
            return user_data.get('media', [])
        else:
            logging.warning(f"No data found for user {user_id}")
            return []
    except Exception as e:
        logging.error(f"Error fetching media for user {user_id}: {e}")
        return []

# Test connection by fetching data for a test user
if __name__ == "__main__":
    test_user_id = "7709483635845058"  # Replace with an actual user ID from your Firestore
    media = fetch_media_from_firebase(test_user_id)
    logging.info(f"Media for test user {test_user_id}: {media}")
