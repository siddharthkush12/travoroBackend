import express from "express";
import { saveFcmToken } from "../../controllers/notification/notification.controllers.js";
import verifyJWT from "../../middleware/verifyJWT.js";


const router = express.Router();

router.post("/save-token",verifyJWT,saveFcmToken); 

export default router;  