import { sendNotification } from "./utils/fcm.js";

const token = "ecCmz-WMTaashNjxASRn9M:APA91bFveZCFAhfPDwh20AsI1ab_4SLYnZVCdwaRn5M_qZQTsoz5Q8L52G6cZnKTHaabVm-6QzdEH2ipFOcX-IwC-xHSaQDHY63xODDrEm869KmNH-pQQ5c";

const test = async () => {
  await sendNotification(
    token,
    "🔥 Test Notification. hello",
    "Backend → Firebase → Android working!"
  );
};

test();