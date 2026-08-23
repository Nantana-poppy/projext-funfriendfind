import {
  createComment,
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  likePost,
} from "../services/post.services.js";

export async function getUserPostsController(req, res, next) {
  try {
    const { userId } = req.params;
    const posts = await getUserPosts(userId);

    res.status(200).json({
      status: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
}

export async function createPostController(req, res, next) {
  try {
    const userId = req.user.id;

    const post = await createPost(userId, req.body);

    res.status(201).json({
      status: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPostDetailController(req, res, next) {
  try {
    const { postId } = req.params;
    const post = await getPostById(postId);

    res.status(200).json({
      status: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
}

export async function likePostController(req, res, next) {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const like = await likePost(postId, userId);

    res.status(201).json({
      status: true,
      message: "Post liked successfully",
      data: like,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCommentController(req, res, next) {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const { comment } = req.body;
    const newComment = await createComment(postId, userId, comment);

    res.status(201).json({
      status: true,
      message: "Comment created successfully",
      data: newComment,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllPostsController(req, res, next) {
  try {
    const posts = await getAllPosts();

    res.status(200).json({
      status: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
}
