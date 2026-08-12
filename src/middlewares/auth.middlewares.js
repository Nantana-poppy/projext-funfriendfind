import createError from "http-errors";
import { verifyToken } from "../utilities/jwt.js";

export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(createError(401, "Authorization header is required"));
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(createError(401, "Token is required"));
    }
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return next(createError(401, "Invalid or expired token"));
  }
}
