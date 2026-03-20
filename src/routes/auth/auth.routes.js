import express from "express"
import { loginUser, signUpUser } from "../../controllers/auth/auth.controllers.js";
import { forgetPassword, resetPassword } from "../../controllers/auth/forgetPassword.controllers.js";


const router=express.Router();

router.post("/signup",signUpUser)
router.post("/login",loginUser)
router.post("/forget-password",forgetPassword)
router.post("/reset-password/:token",resetPassword)


export default router;