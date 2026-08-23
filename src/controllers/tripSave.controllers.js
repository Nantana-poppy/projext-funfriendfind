import { saveTrip } from "../services/tripSave.services.js";

export async function saveTripController(req, res, next) {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;
    const savedTrip = await saveTrip(tripId, userId);
    res.status(201).json({
      status: true,
      message: "Trip saved successfully",
      data: savedTrip,
    });
  } catch (error) {
    next(error);
  }
}
