import { saveTrip } from "../services/tripSave.services.js";

export async function saveTripController(req, res, next) {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;
    const result = await saveTrip(tripId, userId);
    res.status(200).json({
      status: true,
      isSaved: result.isSaved,
      message: result.message,
      data: result.data || null,
      tripId: result.tripId,
    });
  } catch (error) {
    next(error);
  }
}
