import createError from "http-errors";
import prisma from "../lib/prisma.js";
import { registerSchema } from "../validations/schema.js";
import { registerUser } from "../services/auth.services.js";
import { hashPassword } from "../utilities/password.js";
import { createToken } from "../utilities/jwt.js";

export async function register(req, res, next) {
  // validation
  const { firstname, lastname, username, email, password, confirmPassword } =
    req.body;
  const result = registerSchema.parse(req.body);
  console.log("result", result);
  const user = await registerUser(result);

  const token = await createToken(user);
  res.status(201).json({
    status: "success",
    message: "Register successful",
    token: token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
}
