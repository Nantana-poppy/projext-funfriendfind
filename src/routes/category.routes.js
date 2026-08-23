import express from "express";
import { getCategoriesController } from "../controllers/category.controllers.js";

const categoryRoute = express.Router();

categoryRoute.get("/", getCategoriesController);

export default categoryRoute;
