import express from "express";
import { authenticate } from "../middlewares/auth.middlewares.js";
import {
  createCommentController,
  createPostController,
  deletePostController,
  getAllPostsController,
  getPostDetailController,
  likePostController,
  updatePostController,
} from "../controllers/post.controllers.js";

const postRouter = express.Router();

postRouter.get("/", getAllPostsController);
postRouter.post("/", authenticate, createPostController);
postRouter.get("/:postId", getPostDetailController);
postRouter.patch("/:postId", authenticate, updatePostController);
postRouter.delete("/:postId", authenticate, deletePostController);
postRouter.post("/:postId/like", authenticate, likePostController);
postRouter.post("/:postId/comments", authenticate, createCommentController);

export default postRouter;
