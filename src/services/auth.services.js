import createError from "http-errors";
import prisma from "../lib/prisma.js";
import { hashPassword, verifyPassword } from "../utilities/password.js";

export async function registerUser(data) {
  const { username, email, firstName, lastName, password } = data;
  //Check Username
  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUsername) {
    throw createError(409, "Username already exists");
  }
  //Check Email
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingEmail) {
    throw createError(409, "Email already exists");
  }
  //Hash password
  const hashedPassword = await hashPassword(password);
  //Create User
  const user = await prisma.user.create({
    data: { username, email, firstName, lastName, password: hashedPassword },
  });

  return user;
}

export async function loginUser(identity, password) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: identity }, { email: identity }],
    },
  });
  if (!user) {
    throw createError(401, "Invalid username or email");
  }
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw createError(401, "Invalid password");
  }
  return user;
}
