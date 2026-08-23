import prisma from "../lib/prisma.js";
import createError from "http-errors";

export async function getUserProfile(userId) {
  const id = Number(userId);

  if (!Number.isInteger(id) || id < 1) {
    throw createError(400, "Invalid user ID");
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      bio: true,
      createdAt: true,

      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    throw createError(404, "User not found");
  }

  return user;
}

export async function editUserProfile(userId, userData) {
  const id = Number(userId);

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw createError(404, "User not found");
  }

  const { firstName, lastName, username, profileImage, bio } = userData;

  // Check username ซ้ำ
  if (username !== undefined && username !== user.username) {
    const existingUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUsername) {
      throw createError(409, "Username already exists");
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },

    data: {
      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName }),
      ...(username !== undefined && { username }),
      ...(profileImage !== undefined && { profileImage }),
      ...(bio !== undefined && { bio }),
    },

    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      bio: true,
      createdAt: true,
    },
  });

  return updatedUser;
}

export async function getMyTrips(userId) {
  const trips = await prisma.trip.findMany({
    where: {
      ownerId: Number(userId),
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      members: {
        where: {
          status: "ACCEPTED",
        },
        select: {
          id: true,
          userId: true,
        },
      },
    },
  });

  return trips;
}
