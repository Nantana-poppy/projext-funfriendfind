import express from "express";
import { authenticate } from "../middlewares/auth.middlewares.js";
import {
  editUserProfileController,
  getMyTripsController,
  getUserProfileController,
  getUserTripsController,
} from "../controllers/users.controllers.js";
import { authorizeUser } from "../middlewares/authorizeUser.js";
import { getUserPostsController } from "../controllers/post.controllers.js";
import { followUserController } from "../controllers/follow.controllers.js";
import { getSavedTripsController } from "../controllers/saveTrip.controllers.js";

const userRoute = express.Router();

userRoute.get("/me/trips", authenticate, getMyTripsController);
userRoute.get("/:userId/trips", authenticate, getUserTripsController);
userRoute.get("/:userId", authenticate, getUserProfileController);
userRoute.patch("/:userId", authenticate, editUserProfileController);
userRoute.get("/me/posts", authenticate, (req, res, next) => {
  req.params.userId = req.user.id;
  return getUserPostsController(req, res, next);
});
userRoute.get("/:userId/posts", authenticate, getUserPostsController);
userRoute.post("/:userId/follow", authenticate, followUserController);
userRoute.get("/:userId/saved-trips", authenticate, getSavedTripsController);
userRoute.get("/me/saved-trips", authenticate, getSavedTripsController);

export default userRoute;
