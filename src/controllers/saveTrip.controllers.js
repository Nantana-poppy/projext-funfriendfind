import { getSavedTrips } from "../services/saveTrip.services.js";

export async function getSavedTripsController(req, res, next) {
  try {
    const userId = req.user.id;
    const { userId: targetUserId } = req.params;
    const savedTrips = await getSavedTrips(userId, targetUserId);

    res.status(200).json({
      status: true,
      data: savedTrips,
    });
  } catch (error) {
    next(error);
  }
}
