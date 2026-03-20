import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const verifyJWT = (req, res, next) => {
  try {

    const authHeader=req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
      success: false,
      code: 401,
      message: "🚨 Unauthorized. Token missing.",
    });
    }

    const token=authHeader.split(" ")[1]
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    // console.log("Decoded token:", decoded)
    req.user = {
  _id: decoded.id
}
    next()


  } catch (error) {
    return res.status(401).json({
      success: false,
      code: 401,
      message: "🚨 Invalid or expired token.",
    });
  }
};


export default verifyJWT;