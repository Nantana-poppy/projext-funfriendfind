import prisma from "../lib/prisma.js";
import createError from "http-errors";

export async function saveTrip(tripId, userId) {
  const id = Number(tripId);

  if (!Number.isInteger(id) || id < 1) {
    throw createError(400, "Invalid trip ID");
  }

  const trip = await prisma.trip.findUnique({
    where: {
      id,
    },
  });

  if (!trip) {
    throw createError(404, "Trip not found");
  }

  // Check if already saved
  const existingSavedTrip = await prisma.savedTrip.findUnique({
    where: {
      userId_tripId: {
        userId,
        tripId: id,
      },
    },
  });

  if (existingSavedTrip) {
    // Unsave (remove from saved)
    await prisma.savedTrip.delete({
      where: {
        userId_tripId: {
          userId,
          tripId: id,
        },
      },
    });
    return {
      isSaved: false,
      message: "Trip removed from saved trips",
      tripId: id,
    };
  }

  // Save (create saved trip)
  const savedTrip = await prisma.savedTrip.create({
    data: {
      userId,
      tripId: id,
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
          members: {
            select: {
              id: true,
              userId: true,
            },
          },
          _count: {
            select: {
              members: true,
            },
          },
        },
      },
    },
  });

  return {
    isSaved: true,
    message: "Trip saved successfully",
    data: savedTrip,
    tripId: id,
  };
}
