import Profile from "../../models/profile.models.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

const fetchProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "⚠️ Please enter user id",
      });
    }

    const profile = await Profile.findOne({ userId: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: "🔍 Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      code: 200,
      message: "✅ Profile fetched successfully",
      data: profile,
    });
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      success: false,
      code: 500,
      message: "🚨 Something went wrong. Please try again later.",
    });
  }
};





const editProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    console.log("Body",req.body);
    console.log("File",req.file);
    

    const allowedFields=[
      "fullname",
      "dob",
      "phone",
      "gender",
      "city",
      "state",
      "country"
    ]

    const filteredUpdates={}

    allowedFields.forEach(field=>{
      if(updates[field]!==undefined){
        filteredUpdates[field]=updates[field]
      }
    })

    if(req.file){
      const cloudResponse=await uploadOnCloudinary(req.file.buffer)
        console.log("Cloudinary Response:", cloudResponse)

      filteredUpdates.profilePic=cloudResponse.secure_url
    }


    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: userId },
      {$set:filteredUpdates},
      { returnDocument:"after", runValidators: true }
    );


    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: "🔍 Profile not found",
      });
    }


    return res.status(200).json({
      success: true,
      code: 200,
      message: "✅ Profile updated successfully",
      data: updatedProfile,
    });




  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      success: false,
      code: 500,
      message: "🚨 Something went wrong. Please try again later.",
    });
  }
};


const searchProfileByPhone = async (req, res) => {
  try {
    const{phone}=req.query;
    const userId = req.user.id;

    if (!phone) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "⚠️ Please enter Phone number",
      });
    }
    const profile = await Profile.findOne({ phone: phone });

    if(!profile){
      return res.status(400).json({
        success: false,
        code: 400,
        message: "⚠️ User Not found",
      });
    }
    if (profile.userId.toString() === userId) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "⚠️ You cannot add yourself",
      });
    }

    return res.status(200).json({
      success: true,
      code: 200,
      message: "✅ Profile fetched successfully",
      data: profile,
    });


  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      success: false,
      code: 500,
      message: "🚨 Something went wrong. Please try again later.",
    });
  }
}


export { fetchProfile, editProfile, searchProfileByPhone};
