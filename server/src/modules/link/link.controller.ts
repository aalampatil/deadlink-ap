import type { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";
import linkModel from "./link.model.js";
import ApiError from "../../utils/api-error.js";
import { validateUrl } from "../../utils/utils.js";
import { getAuth } from "@clerk/express";

import { isProduction } from "../../index.js";

const createLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) throw ApiError.unauthorised();

    const { displayTitle } = req.body || {};
    const slug = nanoid(12);

    const link = await linkModel.create({
      slug,
      displayTitle:
        typeof displayTitle === "string"
          ? displayTitle.trim().slice(0, 120)
          : "",
      ownerId: userId,
    });

    if (!link) throw ApiError.internalError("Failed to create URL");

    const publicBaseUrl = isProduction
      ? process.env.CLIENT
      : process.env.FRONTEND;
    const publicUrl = `${publicBaseUrl}/l/${link.slug}`;
    const manageUrl = `${publicBaseUrl}/manage/${encodeURIComponent(
      link.slug,
    )}`;

    link.publicUrl = publicUrl;
    link.manageUrl = manageUrl;

    await link.save({ validateBeforeSave: false });
    res.status(201).json({
      slug: link.slug,
      displayTitle: link.displayTitle,
      publicUrl,
      manageUrl,
    });
  } catch (error) {
    next(error);
  }
};

const publicLink = async (req: Request, res: Response) => {
  const { slug } = req.params;
  if (!slug) throw ApiError.badRequest();
  const link = await linkModel.findOne({ slug }).lean();
  if (!link) throw ApiError.notfound();

  res.json({
    slug: link.slug,
    status: link.mappedUrl ? "ready" : "pending",
    displayTitle: link.displayTitle,
    mappedUrl: link.mappedUrl ?? null,
    mappedOn: link.mappedOn,
  });
};

// MANAGE LINK (requires auth + ownership)
const manageLink = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) throw ApiError.unauthorised();

  const { slug } = req.query;
  if (typeof slug !== "string") throw ApiError.badRequest();
  const link = await linkModel.findOne({ slug });
  if (!link) throw ApiError.notfound();
  if (link.ownerId !== userId) throw ApiError.forbidden("Not your link");

  res.json({
    slug: link.slug,
    status: link.mappedUrl ? "ready" : "pending",
    displayTitle: link.displayTitle,
    mappedUrl: link.mappedUrl ?? null,
    mappedOn: link.mappedOn,
  });
};

const mapLink = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) throw ApiError.unauthorised();
  const { slug } = req.params;
  const { targetUrl } = req.body || {};
  if (!slug || typeof targetUrl !== "string") throw ApiError.badRequest();
  const link = await linkModel.findOne({ slug, ownerId: userId });
  if (!link) throw ApiError.notfound();
  // if (link.ownerId !== userId) throw ApiError.forbidden("Not your link");
  link.mappedUrl = validateUrl(targetUrl);
  link.mappedOn = new Date();
  await link.save({ validateBeforeSave: false });

  res.json({
    slug: link.slug,
    status: "ready",
    mappedUrl: link.mappedUrl,
    mappedOn: link.mappedOn,
  });
};

const getAllLinks = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      throw ApiError.unauthorised();
    }

    const links = await linkModel.find({ ownerId: userId });

    return res.status(200).json({
      success: true,
      data: links,
    });
  } catch (error) {
    console.error("Error fetching links:", error);
    throw ApiError.notfound("failed to fetch links");
  }
};

export { createLink, publicLink, manageLink, mapLink, getAllLinks };
