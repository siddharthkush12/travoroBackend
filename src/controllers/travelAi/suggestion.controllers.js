import cron from "node-cron";
import Groq from "groq-sdk";
import Suggestion from "../../models/suggestion.models.js";
import axios from "axios";
import { sendNotification } from "../../utils/fcm.js";
import User from "../../models/user.models.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const prompts = [
  "Suggest a trending travel destination",
  "Suggest a hidden place in India",
  "Suggest a luxury travel destination in India",
  "Suggest a beach destination in India",
  "Suggest a mountain destination in India",
];

// 🔥 IMAGE FUNCTION (IMPROVED)
const getImage = async (place) => {
  try {
    const res = await axios.get("https://api.pexels.com/v1/search", {
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
      params: {
        query: `${place} india travel`,
        per_page: 1,
        orientation: "landscape",
      },
    });

    if (res.data.photos.length > 0) {
      return res.data.photos[0].src.large;
    }

    return `https://source.unsplash.com/featured/?${place},india`;
  } catch (err) {
    return `https://source.unsplash.com/featured/?${place},india`;
  }
};

cron.schedule("0 */6 * * *", async () => {
  try {
    // console.log("Cron running at:", new Date().toLocaleTimeString());

    const prompt = prompts[Math.floor(Math.random() * prompts.length)];

    const ai = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `
${prompt}

Only suggest ONE real place in India 🇮🇳.

STRICT RULES:
- Return ONLY ONE object (not array)
- Keys must be EXACT: title, description, place
- No markdown, no **, no extra text
- Title must be catchy with emoji
- Description: 1–2 lines

Return ONLY JSON:

{
  "title": "",
  "description": "",
  "place": ""
}
`,
        },
      ],
    });

    let text = ai.choices[0].message.content.trim();
    console.log("AI RAW RESPONSE:", text);

    text = text.replace(/```json|```/g, "");

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.log("❌ JSON parse failed:", text);
      return;
    }

    if (Array.isArray(parsed)) {
      parsed = parsed[0];
    }

    let title = parsed?.title || "Explore India";
    let description =
      parsed?.description || "Discover a beautiful destination in India.";
    let place = parsed?.place || title;

    title = title.replace(/\*\*/g, "").trim();

    if (!title) {
      console.log("⚠️ Empty title skipped");
      return;
    }

    const exists = await Suggestion.findOne({ title });

    if (exists) {
      console.log("⚠️ Duplicate skipped");
      return;
    }

    const image = await getImage(place);

    await Suggestion.create({
      title: `🌍 ${title}`,
      description,
      image,
    });

    const users = await User.find({ fcmToken: { $ne: null } });

    for (const user of users) {
      await sendNotification(user.fcmToken, title, description);
       console.log("FCMtoken",user.fcmToken);
    }
   
    

    console.log("🚀 Notifications sent");

    console.log("✅ Suggestion saved:", title);
  } catch (err) {
    console.log("❌ Cron error:", err.message);
  }
});

// 🏠 HOME API
export const getLatestSuggestions = async (req, res) => {
  try {
    const data = await Suggestion.find().sort({ createdAt: -1 }).limit(5);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// 🔔 NOTIFICATION API
export const getAllSuggestions = async (req, res) => {
  try {
    const data = await Suggestion.find().sort({ createdAt: -1 });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
