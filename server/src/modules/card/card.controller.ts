import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db/index.js";
import { socialCardsTable, type SocialCardLink } from "../../db/schema.js";
import { env } from "../../env.js";
import ApiError from "../../utils/api-error.js";

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const isHttpUrl = (value: string) => {
  try {
    const protocol = new URL(value).protocol;
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

const cardLinkSchema = z
  .object({
    label: z.string().trim().min(1).max(40),
    url: z.string().trim().max(2048).optional().default(""),
    type: z.enum(["social", "project"]).optional().default("social"),
    platform: z.string().trim().max(32).optional().default("custom"),
    description: z.string().trim().max(140).optional().default(""),
  })
  .superRefine((link, ctx) => {
    if (link.url && !isHttpUrl(link.url)) {
      ctx.addIssue({
        code: "custom",
        path: ["url"],
        message: "Only http(s) URLs are allowed",
      });
    }

    if (link.type !== "project" && !link.url) {
      ctx.addIssue({
        code: "custom",
        path: ["url"],
        message: "Social links require a URL",
      });
    }
  });

const cardPayloadSchema = z.object({
  slug: z.string().trim().min(3).max(80).optional(),
  displayName: z.string().trim().min(1).max(120),
  displayNameColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional()
    .default("#000000"),
  bio: z.string().trim().max(280).optional().default(""),
  bioColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional()
    .default("#111111"),
  avatarUrl: z.string().trim().url().optional().or(z.literal("")).default(""),
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
  links: z.array(cardLinkSchema).max(12).default([]),
});

const toPublicUrl = (slug: string) => {
  const publicBaseUrl = env.CLIENT;
  return `${publicBaseUrl}/c/${slug}`;
};

const serializeCard = (card: typeof socialCardsTable.$inferSelect) => ({
  id: card.id,
  slug: card.slug,
  displayName: card.displayName,
  displayNameColor: card.displayNameColor,
  bio: card.bio.toUpperCase(),
  bioColor: card.bioColor,
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
    throw ApiError.badRequest(
      parsed.error.issues[0]?.message ?? "Invalid card",
    );
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
    displayNameColor: parsed.data.displayNameColor,
    bio: parsed.data.bio.toUpperCase(),
    bioColor: parsed.data.bioColor,
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
    : await db.insert(socialCardsTable).values(values).returning();

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

  res.set(
    "Cache-Control",
    "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
  );
  res.json({ data: serializeCard(card) });
};

export { getMyCard, upsertMyCard, getPublicCard };
