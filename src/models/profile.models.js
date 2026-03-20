import mongoose, { Schema, model } from "mongoose";


const profileSchema = new Schema(
  {
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    profilePic:{
        type:String,
    },
    fullname: {
      type: String,
      required: true,
    },
    dob:{
        type:String,
    },
    gender:{
        type:String,
        enum:["male","female","other"],
        default:null
    },
    phone:{
        type:String,
    },
    email: {
      type: String,
      required: true,
    },
    city:{
        type:String,
    },
    state:{
        type:String,
    },
    country:{
        type:String,
    },
  },
  { timestamps: true },
);

export default model("Profile",profileSchema)
