importScripts("../firebase-app-compat.js");
importScripts("../firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDkif6kPWr3OcC7lOlLGHTk-pF-dBXzm2c",
  authDomain: "greengo-efa34.firebaseapp.com",
  projectId: "greengo-efa34",
  storageBucket: "greengo-efa34.firebasestorage.app",
  messagingSenderId: "569259777928",
  appId: "1:569259777928:web:81f5618f2d831f630ea43d",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("📩 Received background message ", payload);

  const notificationTitle = payload.notification?.title || "GreenGo";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
