import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String
}, { timestamps: true });

export default mongoose.model("Suggestion", suggestionSchema);