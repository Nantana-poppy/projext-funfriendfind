import express from "express";
import { authenticate } from "../middlewares/auth.middlewares.js";
import {
  acceptJoinRquestController,
  rejectJoinRequestController,
} from "../controllers/tripRequest.controllers.js";

const tripRequestRoute = express.Router();

tripRequestRoute.patch(
  "/:requestId/accept",
  authenticate,
  acceptJoinRquestController,
);
tripRequestRoute.patch(
  "/:requestId/reject",
  authenticate,
  rejectJoinRequestController,
);

export default tripRequestRoute;
