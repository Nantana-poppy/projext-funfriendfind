import prisma from "../lib/prisma.js";
import createError from "http-errors";
import {
  acceptJoinRequest,
  joinTripRequest,
  rejectJoinRequest,
  viewJoinRequest,
} from "../services/tripRequest.services.js";

export async function createJoinRequestController(req, res, next) {
  try {
    const tripId = Number(req.params.tripId);
    const userId = req.user.id;

    const request = await joinTripRequest(tripId, userId);
    res.status(200).json({
      status: true,
      message: "Join request sent successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

export async function viewJoinRequestController(req, res, next) {
  try {
    const tripId = Number(req.params.tripId);
    const userId = req.user.id;

    const request = await viewJoinRequest(tripId, userId);
    res.status(200).json({
      status: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

export async function acceptJoinRquestController(req, res, next) {
  try {
    const requestId = Number(req.params.requestId);
    const userId = req.user.id;

    const request = await acceptJoinRequest(requestId, userId);
    res.status(200).json({
      status: true,
      message: "Join request accepted",
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

export async function rejectJoinRequestController(req, res, next) {
  try {
    const requestId = Number(req.params.requestId);
    const userId = req.user.id;

    const request = await rejectJoinRequest(requestId, userId);

    res.status(200).json({
      status: true,
      message: "Join request rejected",
      data: request,
    });
  } catch (error) {
    next(error);
  }
}
