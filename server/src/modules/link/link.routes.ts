import { Router } from "express";
import {
  createLink,
  manageLink,
  mapLink,
  publicLink,
} from "./link.controller.js";
import { requireAuth } from "@clerk/express";

const linkRouter = Router();

linkRouter.post("/create", requireAuth(), createLink);
linkRouter.get("/public/:slug", publicLink);
linkRouter.get("/manage/:slug", requireAuth(), manageLink);
linkRouter.post("/:slug/map", requireAuth(), mapLink);

export default linkRouter;
