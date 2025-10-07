from flask import Blueprint, request, jsonify 
from app.services.auth_service import get_firebase_uid
from app.services.user_service import get_user_id_by_firebase_uid  
from app.services.schedule_service import schedule_collections
from app.services.notifications_service import create_notifications 
from app.services.user_service import get_user_fcm_token_by_user_id 
from firebase_admin import messaging
from datetime import datetime

schedule_bp = Blueprint('schedule', __name__)

@schedule_bp.route('/schedule', methods=['POST'])
def schedule():
    uid, error_response, status_code = get_firebase_uid()
    if not uid:
        return error_response, status_code

    user_id = get_user_id_by_firebase_uid(uid)
    if not user_id:
        return jsonify({"success": False, "message": "User not found"}), 404

    data = request.get_json() 
    result = schedule_collections(data, user_id)

    raw_date = data.get("date") 
    formatted_date = None

    if raw_date:
        try:
            parsed_date = datetime.fromisoformat(raw_date.replace("Z", ""))
            formatted_date = parsed_date.strftime("%d/%m/%Y")
        except Exception:
            formatted_date = raw_date 

    notif_data = {
        "title": "Collection scheduled",
        "message": f"Your collection has been scheduled for {formatted_date or data.get('date')} between {data.get('timeSlot')}.",
        "type": "collection"
    }

    notification = create_notifications(user_id, notif_data)
 
    if notification:

        userfcm_token = get_user_fcm_token_by_user_id(user_id)
        notif_title = notification.get("result", {}).get("title", "GreenGo")
        notif_body = notification.get("result", {}).get("messages", "")

        print(userfcm_token)
        for token in userfcm_token:
            send_push(token, notif_title, notif_body)

    status_code = 200 if result.get("success") else 400
    return jsonify(result), status_code

def send_push(token: str, title: str, body: str):
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        token=token,
    )
    response = messaging.send(message)
    print("Successfully sent message:", response)