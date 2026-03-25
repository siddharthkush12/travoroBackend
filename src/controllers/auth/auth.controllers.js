import User from "../../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Profile from "../../models/profile.models.js";




const signUpUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "Please fill all required fields",
      });
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(409).json({
        success: false,
        code: 409,
        message: "Account already exists. Please log in.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const profile=new Profile({
      userId:newUser._id,
      fullname:newUser.name,
      email:newUser.email,
      profilePic:"https://res.cloudinary.com/di4eksvat/image/upload/v1771848277/307ce493-b254-4b2d-8ba4-d12c080d6651_poszgl.jpg",
      dob:"",
      gender:null,
      phone:"",
      city:"",
      state:"",
      country:"",
    })

    await profile.save();


    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      code: 201,
      message: "Account created successfully",
      data: {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 500,
      message: "Something went wrong. Please try again later.",
    });
  }
};






const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "Please enter email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: "Account not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        code: 401,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      code: 200,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
    

  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 500,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export { signUpUser, loginUser };