import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middlewares.js";
import { pathNotFound } from "./middlewares/pathNotFound.middlewares.js";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use(express.json());

app.get("/check", (req, res) => {
  res.send("Hello from server2");
});

app.use("/api/auth", authRoute);

app.use(errorHandler);
app.use(pathNotFound);

export default app;
