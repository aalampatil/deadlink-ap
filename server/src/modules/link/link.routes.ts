import { Router } from "express";
import {
  createLink,
  getAllLinks,
  manageLink,
  mapLink,
  publicLink,
} from "./link.controller.js";
import { requireAuth } from "@clerk/express";
const linkRouter = Router();

linkRouter.post("/create", requireAuth(), createLink);
linkRouter.get("/public/:slug", publicLink);
linkRouter.get("/anage/:slugm", requireAuth(), manageLink);
linkRouter.post("/:slug/map", requireAuth(), mapLink);
linkRouter.get("/get-all", requireAuth(), getAllLinks);

export default linkRouter;
