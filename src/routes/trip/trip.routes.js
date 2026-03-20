import express from "express";
import { createTrip, getMyTrips } from "../../controllers/trip/trip.controllers.js";
import verifyJWT from "../../middleware/verifyJWT.js";


const router = express.Router();

router.post("/create", verifyJWT, createTrip);
router.get("/my-trips", verifyJWT, getMyTrips);


export default router;