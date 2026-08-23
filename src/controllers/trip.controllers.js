import {
  createTrips,
  deleteTrip,
  getAcceptedTripMembers,
  getAlltrips,
  getTripById,
  getTripMembers,
  updateTrip,
} from "../services/trip.services.js";
import prisma from "../lib/prisma.js";
import createError from "http-errors";

export async function getTrips(req, res, next) {
  try {
    const trips = await getAlltrips();
    res.status(200).json({
      status: true,
      data: trips,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTripDetail(req, res, next) {
  try {
    const { tripId } = req.params;
    const trip = await getTripById(tripId);
    res.status(200).json({
      status: true,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
}

export async function createTripController(req, res, next) {
  try {
    const userId = req.user.id;

    const tripData = {
      title: req.body.title,
      destination: req.body.destination,
      description: req.body.description,
      budget: req.body.budget,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      maxMember: req.body.maxMember,
      categoryId: req.body.categoryId,
      image: req.body.image,
    };

    const trip = await createTrips(userId, tripData);
    res.status(200).json({
      status: true,
      message: "Trip created successfully",
      data: trip,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTripcontroller(req, res, next) {
  try {
    const userId = req.user.id;
    const tripId = req.tripId;

    const tripData = {
      title: req.body.title,
      destination: req.body.destination,
      description: req.body.description,
      budget: req.body.budget,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      maxMember: req.body.maxMember,
      categoryId: req.body.categoryId,
      image: null,
    };

    const trip = await updateTrip(tripId, userId, tripData);
    res.status(200).json({
      status: true,
      message: "Trip edited successfully",
      data: trip,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTripController(req, res, next) {
  try {
    const userId = req.user.id;

    await deleteTrip(req.tripId, userId);

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getTripMembersController(req, res, next) {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const members = await getTripMembers(tripId, userId);

    res.status(200).json({
      status: true,
      data: members,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAcceptedTripMembersController(req, res, next) {
  try {
    const tripId = req.tripId;

    const members = await getAcceptedTripMembers(tripId);

    res.status(200).json({
      status: true,
      data: members,
    });
  } catch (error) {
    next(error);
  }
}
