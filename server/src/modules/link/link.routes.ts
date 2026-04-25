import { Router } from "express";
import {
  createLink,
  getAllLinks,
  manageLink,
  mapLink,
  publicLink,
} from "./link.controller.js";
import { requireAuth } from "@clerk/express";
import { upload } from "../../middlewares/upload.middleware.js";
const linkRouter = Router();

linkRouter.post("/create", requireAuth(), createLink);
// todo - add upload here
linkRouter.get("/public/:slug", publicLink);
linkRouter.get("/manage/:slug", requireAuth(), manageLink);
linkRouter.post("/:slug/map", requireAuth(), upload.single("file"), mapLink);
linkRouter.get("/get-all", requireAuth(), getAllLinks);
// todo add a delete route
export default linkRouter;
