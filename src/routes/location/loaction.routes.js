import express from "express";
import getNearByPlaces from "../../controllers/location/location.controllers.js";


const router = express.Router();

router.get("/nearby",getNearByPlaces);

export default router;