import ChatGroup from "../../models/chatGroup.models.js";
import Message from "../../models/message.models.js";
import Profile from "../../models/profile.models.js";


export const getMessagingGroups = async (req, res) => {

  try {

    const userId = req.user._id;
    console.log("Logged user:", req.user._id);
    const groups = await ChatGroup.find({

      $or: [
        { createdBy: userId },
        { "members.user": userId }
      ]

    })
    .populate("trip", "title destination coverImage")
    .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: groups
    });

  } catch (error) {

    console.error("Fetch groups error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch groups"
    });

  }

};



export const getMessages = async (req, res) => {

  try {

    const { groupId } = req.params;

    const messages = await Message.find({
      chatGroup: groupId
    })
    .populate("sender", "_id")
    .sort({ createdAt: 1 });

    const messagesWithProfile = await Promise.all(

      messages.map(async (msg) => {

        const profile = await Profile.findOne({
          userId: msg.sender._id
        }).select("fullname profilePic");

        return {
          ...msg.toObject(),
          sender: {
            _id: msg.sender._id,
            fullname: profile?.fullname,
            profilePic: profile?.profilePic
          }
        };

      })

    );

    res.json({
      success: true,
      data: messagesWithProfile
    });

  } catch (error) {
    console.error("Fetch messages error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load messages"
    });

  }

};