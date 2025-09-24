"use client";

import { useEffect } from "react";
import { requestForToken, onMessageListener } from "@/lib/notifications";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { getAuth } from "firebase/auth";

export default function Notifications() {
  useEffect(() => {
    const auth = getAuth();

    auth.currentUser?.getIdToken().then((idToken) => {
      if (!idToken) return;

      requestForToken().then((fcmToken) => {
        if (!fcmToken) return;
        console.log(fcmToken);
        api()
          .post(
            "/notifications/fcm_token",
            { fcm_token: fcmToken },
            { headers: { Authorization: `Bearer ${idToken}` } }
          )
          .then((res) => console.log("FCM token saved:", res.data))
          .catch((err) => console.error("Error saving FCM token:", err));
      });
    });

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
