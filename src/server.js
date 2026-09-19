import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 3000;
console.log(process.env.PORT);

const server = app.listen(PORT, () => {
  console.log(`server is running on : http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error("Server error:", err);
  }
});
