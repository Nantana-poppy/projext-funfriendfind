import { followUser } from "../services/follow.services.js";

export async function followUserController(req, res, next) {
  try {
    const followerId = req.user.id;
    const { userId } = req.params;
    const follow = await followUser(followerId, userId);

    res.status(201).json({
      status: true,
      message: "User followed successfully",
      data: follow,
    });
  } catch (error) {
    next(error);
  }
}
