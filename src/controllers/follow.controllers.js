import { followUser } from "../services/follow.services.js";

export async function followUserController(req, res, next) {
  try {
    const followerId = req.user.id;
    const { userId } = req.params;
    const result = await followUser(followerId, userId);

    res.status(200).json({
      status: true,
      message: result.message,
      isFollowing: result.isFollowing,
      followersCount: result.followersCount,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
}
