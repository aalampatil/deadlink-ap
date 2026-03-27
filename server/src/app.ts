import express from "express";
import linkRouter from "./link/link.routes.js";
import rateLimit from "express-rate-limit";
import cors from "cors";

function createApp() {
  const app = express();

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50, // max requests per IP
    message: {
      error: "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // console.log(limiter);

  app.use(limiter);
  console.log(`${process.env.CLIENT}`);
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

  app.use("/api/link", linkRouter);

  return app;
}

export default createApp;
