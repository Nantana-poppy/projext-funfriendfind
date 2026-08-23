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
    throw createError(409, "User is already followed");
  }

  const follow = await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });

  return follow;
}
