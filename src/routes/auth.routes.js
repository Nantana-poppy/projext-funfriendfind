import express from "express";
import { getMe, login, register } from "../controllers/auth.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";

const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.get("/me", authenticate, getMe);

export default authRoute;
