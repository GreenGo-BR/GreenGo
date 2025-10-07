import { getMessages } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;

// Request permission + get FCM token
export const requestForToken = async () => {
  const messages = getMessages();
  if (!messages) return;
  try {
    const currentToken = await getToken(messages, { vapidKey: VAPID_KEY });
    if (currentToken) {
      return currentToken;
    } else {
      console.warn("⚠️ No registration token available.");
    }
  } catch (err) {
    console.error("Error fetching FCM token", err);
  }
};

// Listen for foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    const messages = getMessages();
    if (!messages) return;

    onMessage(messages, (payload) => {
      resolve(payload);
    });
  });
