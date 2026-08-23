import prisma from "../lib/prisma.js";
import createError from "http-errors";

export async function joinTripRequest(tripId, userId) {
  const trip = await prisma.trip.findUnique({
    where: {
      id: Number(tripId),
    },
  });

  if (!trip) {
    throw createError(404, "Trip not found");
  }
  // Owner ไม่สามารถ request ทริปของตัวเองได้
  if (trip.ownerId === userId) {
    throw createError(400, "Trip owner cannot request to join their own trip");
  }
  // Check สำหรับกัน request ซ้ำ
  const existingRequest = await prisma.tripRequest.findUnique({
    where: {
      tripId_userId: {
        tripId,
        userId,
      },
    },
  });
  if (existingRequest) {
    throw createError(409, "You have already requested to join this trip");
  }
  // Check สมาชิกของ trip ว่าเต็มแล้ว
  const memberCount = await prisma.tripMember.count({
    where: {
      tripId,
    },
  });
  if (memberCount >= trip.maxMember) {
    throw createError(400, "This trip is already full");
  }
  // Create request
  const request = await prisma.tripRequest.create({
    data: {
      tripId: Number(tripId),
      userId: Number(userId),
      status: "PENDING",
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
      trip: {
        select: {
          id: true,
          title: true,
          destination: true,
        },
      },
    },
  });
  return request;
}

export async function viewJoinRequest(tripId, userId) {
  const trip = await prisma.trip.findUnique({
    where: {
      id: tripId,
    },
  });
  if (!trip) {
    throw createError(404, "Trip not found");
  }
  if (trip.ownerId !== userId) {
    throw createError(403, "Only the trip owner can view join requests");
  }

  const requests = await prisma.tripRequest.findMany({
    where: {
      tripId,
    },
    orderBy: {
      requestAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
    },
  });
  return requests;
}

export async function acceptJoinRequest(requestId, ownerId) {
  const request = await prisma.tripRequest.findUnique({
    where: {
      id: requestId,
    },

    include: {
      trip: true,
    },
  });

  if (!request) {
    throw createError(404, "Join request not found");
  }

  // Check owner
  if (request.trip.ownerId !== ownerId) {
    throw createError(403, "Only the trip owner can accept this request");
  }

  // Check request status
  if (request.status !== "PENDING") {
    throw createError(400, "This request has already been processed");
  }

  // Check member count
  const memberCount = await prisma.tripMember.count({
    where: {
      tripId: request.tripId,
    },
  });

  if (memberCount >= request.trip.maxMember) {
    throw createError(400, "This trip is already full");
  }

  // Transaction
  const result = await prisma.$transaction(async (transaction) => {
    const updatedRequest = await transaction.tripRequest.update({
      where: {
        id: requestId,
      },

      data: {
        status: "ACCEPTED",
      },
    });

    await transaction.tripMember.create({
      data: {
        tripId: request.tripId,
        userId: request.userId,
      },
    });

    return updatedRequest;
  });

  return result;
}

export async function rejectJoinRequest(requestId, ownerId) {
  const request = await prisma.tripRequest.findUnique({
    where: {
      id: requestId,
    },

    include: {
      trip: true,
    },
  });

  if (!request) {
    throw createError(404, "Join request not found");
  }

  // Check owner
  if (request.trip.ownerId !== ownerId) {
    throw createError(403, "Only the trip owner can reject this request");
  }

  if (request.status !== "PENDING") {
    throw createError(400, "This request has already been processed");
  }

  const updatedRequest = await prisma.tripRequest.update({
    where: {
      id: requestId,
    },

    data: {
      status: "REJECTED",
    },
  });

  return updatedRequest;
}
