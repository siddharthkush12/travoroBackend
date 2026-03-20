import admin from "../db/firebase.js";

export const sendNotification = async (token, title, body) => {
  try {
    await admin.messaging().send({
      token,
      data: {
        title: title,
        body: body,
      },
      android: {
        priority: "high",
      },
    });

    console.log("🔔 Sent to:", token);
  } catch (err) {
    console.log("❌ FCM Error:", err.message);
  }
};