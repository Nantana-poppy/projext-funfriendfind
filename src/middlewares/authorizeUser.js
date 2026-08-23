import createError from "http-errors";

export function authorizeUser(req, res, next) {
  const userId = Number(req.params.userId);

  if (!Number.isInteger(userId) || userId < 1) {
    return next(createError(400, "Invalid user ID"));
  }

  if (userId !== req.user.id) {
    return next(createError(403, "You can only access your own data"));
  }

  next();
}
