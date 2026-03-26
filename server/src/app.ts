import express from "express";
import linkRouter from "./link/link.routes.js";
import rateLimit from "express-rate-limit";
import cors from "cors";
import ApiError from "./utils/api-error.js";

function createApp() {
  const app = express();

  // global rate limiter
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // max requests per IP
    message: {
      error: "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(limiter);
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.CLIENT,
  ].filter(Boolean) as string[];

  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());
  app.use(express.urlencoded());

  app.use("/api/link", linkRouter);

  return app;
}

export default createApp;
