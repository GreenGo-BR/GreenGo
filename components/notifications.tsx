"use client";

import { useEffect } from "react";
import { requestForToken, onMessageListener } from "@/lib/notifications";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { getAuth } from "firebase/auth";

export default function Notifications() {
  useEffect(() => {
    const auth = getAuth();

    // Step 1: Check if notifications are allowed
    if (Notification.permission === "denied") {
      console.warn(
        "🔕 Notifications are blocked. Ask user to enable in browser settings."
      );
      return;
    }

    // Step 2: Request permission if not already granted
    Notification.requestPermission().then(async (permission) => {
      if (permission !== "granted") {
        console.warn("🔔 Notifications permission not granted:", permission);
        return;
      }
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) return;

      requestForToken().then((fcmToken) => {
        if (!fcmToken) return;
        console.log("✅ Got FCM token:", fcmToken);

        api()
          .post(
            "/notifications/fcm_token",
            { fcm_token: fcmToken },
            { headers: { Authorization: `Bearer ${idToken}` } }
          )
          .then((res) => console.log("✅ FCM token saved:", res.data))
          .catch((err) => console.error("❌ Error saving FCM token:", err));
      });
    });

    // Step 4: Handle foreground messages
    onMessageListener().then((payload: any) => {
      console.log("📩 Foreground message received:", payload);

      const { title, body, image } = payload?.notification || {};

      if (title || body || image) {
        toast({
          title: title || "GreenGo",
          description: body,
          image: image,
        });
      }
    });
  }, []);

  return null;
}
