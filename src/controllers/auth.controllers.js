import createError from "http-errors";
import prisma from "../lib/prisma.js";
import { loginSchema, registerSchema } from "../validations/schema.js";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/auth.services.js";
import { hashPassword } from "../utilities/password.js";
import { createToken } from "../utilities/jwt.js";

export async function register(req, res, next) {
  // validation
  const { firstname, lastname, username, email, password, confirmPassword } =
    req.body;
  try {
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
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  const { identity, password } = req.body;
  try {
    const result = loginSchema.parse(req.body);
    console.log("result", result);
    const user = await loginUser(result.identity, result.password);

    const token = await createToken(user);
    res.status(200).json({
      status: "success",
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await getCurrentUser(req.user.id);
    res.status(200).json({
      status: "Success",
      user,
    });
  } catch (error) {
    next(error);
  }
}
