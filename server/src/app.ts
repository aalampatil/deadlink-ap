import express from "express";
import linkRouter from "./modules/link/link.routes.js";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import type { Request, Response } from "express";

// http://localhost:5000/api/user/profile

function createApp() {
  const app = express();

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
      error: "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // console.log(limiter);
  app.use(limiter);
  app.use(clerkMiddleware());
  // CORS
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://deadlink-ap.aalampatil.online", // production frontend
    process.env.CLIENT || "", // fallback if set
  ].filter(Boolean); // remove empty strings

  app.use(
    cors({
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    }),
  );

  // Handle preflight requests
  app.options("*", cors({ origin: allowedOrigins, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded());

  app.get("/", (req: Request, res: Response) => {
    res.send("OK 200, check");
  });
  app.use("/api/link", linkRouter);
  // app.use("/api/user", userRouter);

  return app;
}

export default createApp;
