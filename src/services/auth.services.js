import prisma from "../lib/prisma.js";
import { hashPassword } from "../utilities/password.js";

export async function registerUser(data) {
  const { username, email, firstName, lastName, password } = data;

  const existingUsername = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUsername) {
    throw new Error("Username already exists");
  }

  const existingEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingEmail) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      firstName,
      lastName,
      password: hashedPassword,
    },
  });

  return user;
}
