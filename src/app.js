import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middlewares.js";
import { pathNotFound } from "./middlewares/pathNotFound.middlewares.js";
import tripRoute from "./routes/trip.routes.js";
import tripRequestRoute from "./routes/tripRequest.routes.js";
import categoryRoute from "./routes/category.routes.js";
import userRoute from "./routes/users.routes.js";
import postRouter from "./routes/post.routes.js";

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
app.use("/api/trips", tripRoute);
app.use("/api/requests", tripRequestRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/users", userRoute)
app.use("/api/posts", postRouter)

app.use(errorHandler);
app.use(pathNotFound);

export default app;
