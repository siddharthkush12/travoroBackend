
import express from "express";
import { acceptAiTrip, addMembersToTrip, deleteTrip, generateTravelPlan } from "../../controllers/travelAi/travelAi.controllers.js";
import verifyJWT from "../../middleware/verifyJWT.js";
import { getAllSuggestions, getLatestSuggestions } from "../../controllers/travelAi/suggestion.controllers.js";


const router = express.Router();

router.post("/generate-plan",verifyJWT,generateTravelPlan);
router.post("/accept-trip",verifyJWT,acceptAiTrip);
router.post("/add-members/:tripId",verifyJWT,addMembersToTrip);
router.delete("/delete-trip/:tripId",verifyJWT,deleteTrip);

router.get("/suggestions/latest", getLatestSuggestions);
router.get("/suggestions/all", getAllSuggestions);





export default router;