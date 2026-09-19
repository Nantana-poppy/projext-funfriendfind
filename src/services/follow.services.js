import prisma from "../lib/prisma.js";
import createError from "http-errors";

export async function followUser(userId, targetUserId) {
  const followerId = Number(userId);
  const followingId = Number(targetUserId);

  if (!Number.isInteger(followingId) || followingId < 1) {
    throw createError(400, "Invalid user ID");
  }

  // ไม่สามารถ Follow ตัวเอง
  if (followerId === followingId) {
    throw createError(400, "You cannot follow yourself");
  }

  // Check target user
  const targetUser = await prisma.user.findUnique({
    where: {
      id: followingId,
    },
  });

  if (!targetUser) {
    throw createError(404, "User not found");
  }

  // Check already following
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (existingFollow) {
    // Unfollow
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    const followersCount = await prisma.follow.count({
      where: { followingId },
    });

    return {
      isFollowing: false,
      message: "Unfollowed successfully",
      followersCount,
    };
  }

  // Follow
  const follow = await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });

  const followersCount = await prisma.follow.count({
    where: { followingId },
  });

  return {
    isFollowing: true,
    message: "User followed successfully",
    followersCount,
    data: follow,
  };
}
