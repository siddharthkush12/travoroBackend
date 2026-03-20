import express from "express";
import { getMessages, getMessagingGroups} from "../../controllers/messaging/message.controllers.js";
import verifyJWT from "../../middleware/verifyJWT.js";


const router = express.Router();


router.get("/messagingGroup", verifyJWT, getMessagingGroups);
router.get("/getMessages/:groupId",verifyJWT,getMessages)



export default router;