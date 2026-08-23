import express from "express";
import {
  createTripController,
  deleteTripController,
  getAcceptedTripMembersController,
  getTripDetail,
  getTripMembersController,
  getTrips,
  updateTripcontroller,
} from "../controllers/trip.controllers.js";
import { validateTripId } from "../middlewares/trip.middlewares.js";
import { getTripById } from "../services/trip.services.js";
import { authenticate } from "../middlewares/auth.middlewares.js";
import {
  createJoinRequestController,
  viewJoinRequestController,
} from "../controllers/tripRequest.controllers.js";
import { saveTripController } from "../controllers/tripSave.controllers.js";

const tripRoute = express.Router();

tripRoute.get("/", getTrips);
tripRoute.post("/", authenticate, createTripController);
tripRoute.get("/:tripId", validateTripId, getTripDetail);
tripRoute.patch("/:tripId", authenticate, validateTripId, updateTripcontroller);
tripRoute.delete(
  "/:tripId",
  authenticate,
  validateTripId,
  deleteTripController,
);

tripRoute.post("/:tripId/requests", authenticate, createJoinRequestController);
tripRoute.get("/:tripId/requests", authenticate, viewJoinRequestController);
tripRoute.post("/:tripId/save", authenticate, saveTripController);
tripRoute.get(
  "/:tripId/members",
  authenticate,
  validateTripId,
  getAcceptedTripMembersController,
);

export default tripRoute;
