import createError from "http-errors";
import prisma from "../lib/prisma.js";
import { registerSchema } from "../validations/schema.js";
import { registerUser } from "../services/auth.services.js";

export async function register(req, res, next) {
  const { firstname, lastname, username, email, password, confirmPassword } =
    req.body;
  const result = registerSchema.parse(req.body);
  console.log("result", result);
  const user = await registerUser(result);

  res.status(201).json({
    status: "success",
    message: "Register successful",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
}
