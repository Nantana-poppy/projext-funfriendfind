import prisma from "../lib/prisma.js";
import createError from "http-errors";

export async function saveTrip(tripId, userId) {
  console.log("savedTrip:", prisma.savedTrip);
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

  // Check ว่ากดบันทึกไปแล้วให้แจ้งเตือนกลับไป
  const existingSavedTRip = await prisma.savedTrip.findUnique({
    where: {
      userId_tripId: {
        userId,
        tripId: id,
      },
    },
  });

  if (existingSavedTRip) {
    throw createError(409, "Trip has already been saved");
  }

  const savedTrip = await prisma.savedTrip.create({
    data: {
      userId,
      tripId: id,
    },
    include: {
      trip: {
        select: {
          id: true,
          title: true,
          destination: true,
          image: true,
          startDate: true,
          endDate: true,
          budget: true,
        },
      },
    },
  });
  return savedTrip;
}
