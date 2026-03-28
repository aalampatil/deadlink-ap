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
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        process.env.CLIENT as string,
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded());

  app.get("/", (req: Request, res: Response) => {
    res.send("OK 200, check");
  });
  app.use("/api/link", linkRouter);
  // app.use("/api/user", userRouter);

  return app;
}

export default createApp;
