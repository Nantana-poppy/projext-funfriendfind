import express from "express";
import { register } from "../controllers/auth.controllers.js";

const authRoute = express.Router();

authRoute.post("/register", register);

export default authRoute;
