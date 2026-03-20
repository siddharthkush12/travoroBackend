import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

  chatGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatGroup"
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  text: String,

  type: {
    type: String,
    enum: ["text","image","video","file"],
    default: "text"
  },

  mediaUrl: String

}, { timestamps: true });

export default mongoose.model("Message", messageSchema);