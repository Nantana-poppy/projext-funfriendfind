import z from "zod";

export function errorHandler(err, req, res, next) {
  if (err instanceof z.ZodError) {
    res.status(400).json({
      status: false,
      message: "Validation error",
      error: z.flattenError(err).fieldErrors,
    });
  } else {
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
      status: false,
      message: err.message || "Internal Server Error",
    });
  }
}
