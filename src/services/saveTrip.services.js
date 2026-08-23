import prisma from "../lib/prisma.js";
import createError from "http-errors";

export async function getSavedTrips(userId, targetUserId) {
  const currentUserId = Number(userId);
  const requestedUserId = Number(targetUserId);

  if (!Number.isInteger(requestedUserId) || requestedUserId < 1) {
    throw createError(400, "Invalid user ID");
  }

  // ดูได้เฉพาะ Saved Trips ของตัวเอง
  if (currentUserId !== requestedUserId) {
    throw createError(403, "You can only view your own saved trips");
  }

  const savedTrips = await prisma.savedTrip.findMany({
    where: {
      userId: requestedUserId,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      trip: {
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
        },
      },
    },
  });

  return savedTrips;
}
