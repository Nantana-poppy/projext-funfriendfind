import z from "zod";

export const pathNotFound = (req, res) => {
  res.status(400).json({
    status: "Error",
    message: "Path Not Found",
  });
};
