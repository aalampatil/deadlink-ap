import type { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";
import { db } from "../../db/index.js";
import ApiError from "../../utils/api-error.js";
import { validateUrl } from "../../utils/utils.js";
import { getAuth } from "@clerk/express";
import { isProduction } from "../../index.js";
import { linksTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { env } from "../../env.js";

const createLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) throw ApiError.unauthorised();

    const { displayTitle } = req.body || {};
    const slug = nanoid(12);

    const cleanTitle =
      typeof displayTitle === "string" ? displayTitle.trim().slice(0, 120) : "";

    const publicBaseUrl = isProduction ? env.CLIENT : env.FRONTEND;

    const publicUrl = `${publicBaseUrl}/l/${slug}`;
    const manageUrl = `${publicBaseUrl}/manage/${encodeURIComponent(slug)}`;

    const [link] = await db
      .insert(linksTable)
      .values({
        slug,
        displayTitle: cleanTitle,
        ownerId: userId,
        publicUrl,
        manageUrl,
      })
      .returning();
    console.log(link);

    if (!link) throw ApiError.internalError("failed to create db");

    res.status(201).json({
      slug: link.slug,
      displayTitle: link.displayTitle,
      publicUrl: link.publicUrl,
      manageUrl: link.manageUrl,
    });
  } catch (error) {
    next(error);
  }
};

const publicLink = async (req: Request, res: Response) => {
  const { slug } = req.params;
  if (!slug) throw ApiError.badRequest();

  const [link] = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.slug, slug as string));

  if (!link) throw ApiError.notfound();

  res.json({
    slug: link.slug,
    status: link.status, // ✅ from computed column
    displayTitle: link.displayTitle,
    mappedUrl: link.mappedUrl ?? null,
    mappedOn: link.mappedOn,
  });
};

//#endregion

// MANAGE LINK (requires auth + ownership)
const manageLink = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) throw ApiError.unauthorised();

  const { slug } = req.query;
  if (typeof slug !== "string") throw ApiError.badRequest();

  const [link] = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.slug, slug));

  if (!link) throw ApiError.notfound();
  if (link.ownerId !== userId) throw ApiError.forbidden("Not your link");

  res.json({
    slug: link.slug,
    status: link.status,
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

  if (!slug || typeof targetUrl !== "string") {
    throw ApiError.badRequest();
  }

  const validUrl = validateUrl(targetUrl);

  const [link] = await db
    .update(linksTable)
    .set({
      mappedUrl: validUrl,
      mappedOn: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(linksTable.slug, slug as string))
    .returning();

  if (!link) throw ApiError.notfound();
  if (link.ownerId !== userId) throw ApiError.forbidden("Not your link");

  res.json({
    slug: link.slug,
    status: link.status, // auto from DB
    mappedUrl: link.mappedUrl,
    mappedOn: link.mappedOn,
  });
};

const getAllLinks = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) throw ApiError.unauthorised();

  const links = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.ownerId, userId));

  res.status(200).json({
    success: true,
    data: links,
  });
};

export { createLink, publicLink, manageLink, mapLink, getAllLinks };
