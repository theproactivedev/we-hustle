import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";

import { disconnectDB } from "./config/db.js";
import applicationsRouter from "./routes/applications.js";
// Import Routes
import authRouter from "./routes/auth.js";
// import usersRouter from './routes/users.js';
import jobsRouter from "./routes/jobs.js";

config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5001;

// Middleware to parse JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Middleware to parse cookies


// API Routes
app.use("/api/auth", authRouter);
// app.use('/api/users', usersRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/applications", applicationsRouter);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.error("SIGTERM received, shutting down gracefully...");
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});
