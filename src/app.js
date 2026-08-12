import express from "express";
import authRoute from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middlewares.js";
import { pathNotFound } from "./middlewares/pathNotFound.middlewares.js";

const app = express();
app.use(express.json());

app.get("/check", (req, res) => {
  res.send("Hello from server2");
});

app.use("/auth", authRoute);

app.use(errorHandler);
app.use(pathNotFound);

export default app;
