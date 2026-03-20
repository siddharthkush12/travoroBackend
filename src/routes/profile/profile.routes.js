import express from "express"
import { editProfile, fetchProfile, searchProfileByPhone } from "../../controllers/profile/profile.controllers.js";
import verifyJWT from "../../middleware/verifyJWT.js";
import multer from "multer";




const storage=multer.memoryStorage()
const upload = multer({storage})
const router=express.Router();

router.get("/fetch",verifyJWT,fetchProfile)
router.put("/edit",verifyJWT,upload.single("profilePic"),editProfile)
router.get("/search-phone",verifyJWT,searchProfileByPhone)



export default router;