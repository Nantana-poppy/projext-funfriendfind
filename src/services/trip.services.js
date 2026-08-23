import { includes } from "zod";
import prisma from "../lib/prisma.js";
import createError from "http-errors";

// View Trips
export async function getAlltrips() {
  const trips = await prisma.trip.findMany({
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
    },
  });
  return trips;
}

// View Trip Detail
export async function getTripById(tripId) {
  const trip = await prisma.trip.findUnique({
    where: {
      id: Number(tripId),
    },
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          bio: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              bio: true,
            },
          },
        },
        orderBy: {
          joinedAt: "asc",
        },
      },
    },
  });

  if (!trip) {
    throw createError(404, "Trip not found");
  }
  return trip;
}

// Create Trip
export async function createTrips(userId, tripData) {
  const {
    title,
    destination,
    description,
    budget,
    startDate,
    endDate,
    maxMember,
    categoryId,
    image,
  } = tripData;

  //find category ID
  const category = await prisma.category.findUnique({
    where: {
      id: Number(categoryId),
    },
  });
  if (!category) {
    throw createError(404, "Category not found");
  }
  if (new Date(startDate) >= new Date(endDate)) {
    throw createError(400, "End date nust be after start date");
  }
  if (Number(maxMember) < 1) {
    throw createError(400, "Max member must be at least 1");
  }

  const trip = await prisma.trip.create({
    data: {
      title,
      destination,
      description,
      budget: Number(budget),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      maxMember: Number(maxMember),
      image: image,

      owner: {
        connect: {
          id: userId,
        },
      },

      category: {
        connect: {
          id: Number(categoryId),
        },
      },

      members: {
        create: {
          userId,
        },
      },
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
      },
    },
  });
  return trip;
  console.log("trip", trip);
}

// Edit trip
export async function updateTrip(tripId, userId, tripData) {
  const trip = await prisma.trip.findUnique({
    where: {
      id: Number(tripId),
    },
  });

  if (!trip) {
    throw createError(404, "Trip not found");
  }

  if (trip.ownerId !== userId) {
    throw createError(403, "Only the trip owner can edit this");
  }

  const {
    title,
    destination,
    description,
    budget,
    startDate,
    endDate,
    maxMember,
    categoryId,
    image,
  } = tripData;

  if (categoryId !== undefined) {
    const category = await prisma.category.findUnique({
      where: {
        id: Number(categoryId),
      },
    });

    if (!categoryId) {
      throw createError(404, "Category not found");
    }
  }
  const newStartDate = startDate ? new Date(startDate) : trip.startDate;
  const newEndDate = endDate ? new Date(endDate) : trip.endDate;

  if (newStartDate >= newEndDate) {
    throw createError(400, "End date must be after start date");
  }

  const updateTrip = await prisma.trip.update({
    where: {
      id: tripId,
    },
    data: {
      ...(title !== undefined && { title }),
      ...(destination !== undefined && { destination }),
      ...(description !== undefined && { description }),
      ...(budget !== undefined && { budget: Number(budget) }),
      ...(startDate !== undefined && { startDate: new Date(startDate) }),
      ...(endDate !== undefined && { endDate: new Date(endDate) }),
      ...(maxMember !== undefined && { maxMember: Number(maxMember) }),
      ...(categoryId !== undefined && { categoryId: Number(categoryId) }),
      ...(image !== undefined && { image }),
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
      },
    },
  });
  return updateTrip;
}

// Delete Trip
export async function deleteTrip(tripId, userId) {
  const trip = await prisma.trip.findUnique({
    where: { id: Number(tripId) },
  });

  if (!trip) {
    throw createError(404, "trip not found");
  }

  if (trip.ownerId !== userId) {
    throw createError(403, "Only the trip owner can delete this trip");
  }

  await prisma.trip.delete({
    where: {
      id: tripId,
    },
  });
  return trip;
}

// View Trip Members
export async function getTripMembers(tripId, userId) {
  const trip = await prisma.trip.findUnique({
    where: {
      id: Number(tripId),
    },
  });

  if (!trip) {
    throw createError(404, "Trip not found");
  }

  // Check owner
  if (trip.ownerId !== userId) {
    throw createError(403, "Only the trip owner can view trip members");
  }

  const members = await prisma.tripMember.findMany({
    where: {
      tripId: Number(tripId),
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          bio: true,
        },
      },
    },
    orderBy: {
      joinedAt: "asc",
    },
  });

  return members;
}

export async function getAcceptedTripMembers(tripId) {
  const trip = await prisma.trip.findUnique({
    where: {
      id: Number(tripId),
    },
  });

  if (!trip) {
    throw createError(404, "Trip not found");
  }

  const members = await prisma.tripMember.findMany({
    where: {
      tripId: Number(tripId),
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          bio: true,
        },
      },
    },
    orderBy: {
      joinedAt: "asc",
    },
  });

  return members;
}
