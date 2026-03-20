import User from "../../models/user.models.js";

export const saveFcmToken = async (req, res) => {
  try {
    const { token } = req.body;

    const userId = req.user._id

    const user = await User.findById(userId);

    if (!user) {
      console.log("❌ No user found");
      return res.status(404).json({ success: false });
    }

    user.fcmToken = token;

    const updatedUser = await user.save();



    res.json({ success: true });

  } catch (err) {
    console.log("❌ Error:", err.message);
    res.status(500).json({ success: false });
  }
};