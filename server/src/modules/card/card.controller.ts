import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db/index.js";
import { socialCardsTable, type SocialCardLink } from "../../db/schema.js";
import { env } from "../../env.js";
import { isProduction } from "../../index.js";
import ApiError from "../../utils/api-error.js";

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const cardLinkSchema = z.object({
  label: z.string().trim().min(1).max(40),
  url: z
    .string()
    .trim()
    .url()
    .refine((value) => {
      const protocol = new URL(value).protocol;
      return protocol === "http:" || protocol === "https:";
    }, "Only http(s) URLs are allowed"),
  type: z.enum(["social", "project"]).optional().default("social"),
  platform: z.string().trim().max(32).optional().default("custom"),
  description: z.string().trim().max(140).optional().default(""),
});

const cardPayloadSchema = z.object({
  slug: z.string().trim().min(3).max(80).optional(),
  displayName: z.string().trim().min(1).max(120),
  bio: z.string().trim().max(280).optional().default(""),
  avatarUrl: z
    .string()
    .trim()
    .url()
    .optional()
    .or(z.literal(""))
    .default(""),
  backgroundImageUrl: z
    .string()
    .trim()
    .url()
    .optional()
    .or(z.literal(""))
    .default(""),
  accentColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional()
    .default("#facc00"),
  links: z.array(cardLinkSchema).max(10).default([]),
});

const toPublicUrl = (slug: string) => {
  const publicBaseUrl = isProduction ? env.CLIENT : env.FRONTEND;
  return `${publicBaseUrl}/c/${slug}`;
};

const serializeCard = (card: typeof socialCardsTable.$inferSelect) => ({
  id: card.id,
  slug: card.slug,
  displayName: card.displayName,
  bio: card.bio,
  avatarUrl: card.avatarUrl,
  backgroundImageUrl: card.backgroundImageUrl,
  accentColor: card.accentColor,
  links: card.links,
  publicUrl: card.publicUrl,
  createdAt: card.createdAt,
  updatedAt: card.updatedAt,
});

const getMyCard = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) throw ApiError.unauthorised();

  const [card] = await db
    .select()
    .from(socialCardsTable)
    .where(eq(socialCardsTable.ownerId, userId));

  res.json({ data: card ? serializeCard(card) : null });
};

const upsertMyCard = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) throw ApiError.unauthorised();

  const parsed = cardPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    throw ApiError.badRequest(parsed.error.issues[0]?.message ?? "Invalid card");
  }

  const cleanSlug = slugify(parsed.data.slug || parsed.data.displayName);
  if (!cleanSlug) throw ApiError.badRequest("Slug is required");

  const [conflictingCard] = await db
    .select({ id: socialCardsTable.id })
    .from(socialCardsTable)
    .where(
      and(
        eq(socialCardsTable.slug, cleanSlug),
        ne(socialCardsTable.ownerId, userId),
      ),
    );

  if (conflictingCard) {
    throw ApiError.badRequest("This card slug is already taken");
  }

  const [existingCard] = await db
    .select()
    .from(socialCardsTable)
    .where(eq(socialCardsTable.ownerId, userId));

  const values = {
    ownerId: userId,
    slug: cleanSlug,
    displayName: parsed.data.displayName,
    bio: parsed.data.bio,
    avatarUrl: parsed.data.avatarUrl,
    backgroundImageUrl: parsed.data.backgroundImageUrl,
    accentColor: parsed.data.accentColor,
    links: parsed.data.links as SocialCardLink[],
    publicUrl: toPublicUrl(cleanSlug),
    updatedAt: new Date(),
  };

  const [card] = existingCard
    ? await db
        .update(socialCardsTable)
        .set(values)
        .where(eq(socialCardsTable.ownerId, userId))
        .returning()
    : await db
        .insert(socialCardsTable)
        .values(values)
        .returning();

  if (!card) throw ApiError.internalError("Failed to save card");

  res.status(existingCard ? 200 : 201).json({ data: serializeCard(card) });
};

const getPublicCard = async (req: Request, res: Response) => {
  const { slug } = req.params;
  if (typeof slug !== "string") throw ApiError.badRequest("Missing card slug");

  const [card] = await db
    .select()
    .from(socialCardsTable)
    .where(eq(socialCardsTable.slug, slug));

  if (!card) throw ApiError.notfound("Card not found");

  res.json({ data: serializeCard(card) });
};

export { getMyCard, upsertMyCard, getPublicCard };
