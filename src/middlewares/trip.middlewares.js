import createError from "http-errors";

export function validateTripId(req, res, next) {
  const tripId = Number(req.params.tripId);

  if (!Number.isInteger(tripId) || tripId <= 0) {
    return next(createError(400, "Invalid trip ID"));
  }
  req.tripId = tripId;
  next();
}
