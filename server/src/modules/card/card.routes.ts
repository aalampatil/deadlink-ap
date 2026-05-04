import { Router } from "express";
import { requireAuth } from "@clerk/express";
import {
  getMyCard,
  getPublicCard,
  upsertMyCard,
} from "./card.controller.js";

const cardRouter = Router();

cardRouter.get("/me", requireAuth(), getMyCard);
cardRouter.put("/me", requireAuth(), upsertMyCard);
cardRouter.get("/public/:slug", getPublicCard);

export default cardRouter;
