import Message from "../models/message.models.js";
import Profile from "../models/profile.models.js";

export const socketHandler = (io) => {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // join chat group
    socket.on("join-group", (groupId) => {
      socket.join(groupId);
    });

    // send message
    socket.on("send-message", async (data) => {

      try {

        const { groupId, senderId, text, type, mediaUrl } = data;

        // 🔹 find profile using userId
        const profile = await Profile.findOne({ userId: senderId });

        if (!profile) {
          console.log("Profile not found");
          return;
        }

        // 🔹 save message with profileId
        const message = await Message.create({
          chatGroup: groupId,
          sender: senderId,
          text,
          type,
          mediaUrl
        });

        // 🔹 populate sender
        const populated = await Message.findById(message._id)
          .populate("sender", "fullname profilePic");

        // 🔹 send message to group
        io.to(groupId).emit("receive-message", populated);

      } catch (error) {
        console.error("Socket message error:", error);
      }

    });

  });

};