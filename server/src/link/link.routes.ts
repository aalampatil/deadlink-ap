import { Router } from "express";
import {
  createLink,
  manageLink,
  mapLink,
  publicLink,
} from "./link.controller.js";

const linkRouter = Router();

linkRouter.post("/create", createLink);
linkRouter.get("/public/:slug", publicLink);
linkRouter.get("/manage/:slug", manageLink);
linkRouter.post("/:slug/map", mapLink);

export default linkRouter;
