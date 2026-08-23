import express from "express";
import { authenticate } from "../middlewares/auth.middlewares.js";
import {
  createCommentController,
  createPostController,
  getAllPostsController,
  getPostDetailController,
  likePostController,
} from "../controllers/post.controllers.js";

const postRouter = express.Router();

postRouter.get("/", getAllPostsController);
postRouter.post("/", authenticate, createPostController);
postRouter.get("/:postId", getPostDetailController);
postRouter.post("/:postId/like", authenticate, likePostController);
postRouter.post("/:postId/comments", authenticate, createCommentController);

export default postRouter;
