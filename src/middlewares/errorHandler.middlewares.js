import z from "zod";

export function errorHandler(err, req, res, next) {
  if (err instanceof z.ZodError) {
    res.status(400).json({
      status: "Error",
      message: "Validation error",
      error: z.flattenError(err).fieldErrors,
    });
  } else {
    res.status = err.status || 500;
    res.json({
      status: "Error",
      message: err.message || "Internal Server Error",
    });
  }
}
