import type { Request, Response } from "express";
import { nanoid } from "nanoid";
import { isDevelopment } from "../index.js";
import linkModel from "./link.model.js";
import ApiError from "../utils/api-error.js";
import { hashKey, generateMappingKey, validateUrl } from "../utils/utils.js";

const createLink = async (req: Request, res: Response) => {
  const { displayTitle } = req.body || {};

  const slug = nanoid(12);
  const mappingKey = generateMappingKey();
  const mappingKeyHash = hashKey(mappingKey);

  const linkDoc = await linkModel.create({
    slug,
    displayTitle:
      typeof displayTitle === "string" ? displayTitle.trim().slice(0, 120) : "",
    mappingKeyHash,
  });

  if (!linkDoc) {
    throw ApiError.internalError("failed to create url");
  }

  const publicBaseUrl = isDevelopment
    ? process.env.FRONTEND
    : process.env.CLIENT;
  const publicUrl = `${publicBaseUrl}/l/${linkDoc.slug}`;
  const manageUrl = `${publicBaseUrl}/manage?slug=${encodeURIComponent(
    linkDoc.slug,
  )}&key=${encodeURIComponent(mappingKey)}`;

  console.log({ publicUrl });
  console.log({ manageUrl });

  res.status(201).json({
    slug: linkDoc.slug,
    status: (linkDoc as any).status,
    displayTitle: linkDoc.displayTitle,
    mappingKey,
    publicUrl,
    manageUrl,
  });
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
    mappedUrl: link.mappedUrl ? link.mappedUrl : null,
    mappedAt: link.mappedOn,
  });
};

const manageLink = async (req: Request, res: Response) => {
  const { slug } = req.params;
  if (!slug) throw ApiError.badRequest();
  const key = req.query.key;
  if (typeof key !== "string" || !key)
    throw ApiError.badRequest("invalid format");

  const link = await linkModel.findOne({ slug }).lean();
  if (!link) throw ApiError.notfound();

  const keyHash = hashKey(key);
  if (keyHash !== link.mappingKeyHash) throw ApiError.badRequest("invalid key");

  res.json({
    slug: link.slug,
    status: link.mappedUrl ? "ready" : "pending",
    displayTitle: link.displayTitle,
    mappedUrl: link.mappedUrl,
    mappedAt: link.mappedOn,
  });
};

const mapLink = async (req: Request, res: Response) => {
  console.log(req.body);
  const { slug } = req.params;
  if (isDevelopment) console.log(slug);

  if (!slug) throw ApiError.badRequest();
  const { key, targetUrl } = req.body || {};
  if (isDevelopment) {
    console.table([key, targetUrl]);
  }

  if (typeof key !== "string" || !key) {
    throw ApiError.badRequest("invalid key type");
  }

  if (typeof targetUrl !== "string" || !key) {
    throw ApiError.badRequest("missing key");
  }

  const link = await linkModel.findOne({ slug });
  if (!link) throw ApiError.notfound();
  const keyHash = hashKey(key);
  if (keyHash !== link.mappingKeyHash) throw ApiError.badRequest("invalid key");

  const url = validateUrl(targetUrl);

  link.mappedUrl = url;
  link.mappedOn = new Date();
  await link.save();

  res.json({
    slug: link.slug,
    status: "ready to be served",
    mappedUrl: link.mappedUrl,
    mappedOn: link.mappedOn,
  });
};

export { createLink, publicLink, manageLink, mapLink };
