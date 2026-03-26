import { nanoid } from "nanoid";
import crypto from "crypto";
import { isDevelopment } from "../index.js";

function hashKey(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function generateMappingKey(): string {
  return crypto.randomBytes(32).toString("base64url");
}

function baseUrl(): string {
  const url = isDevelopment
    ? `${process.env.FRONTEND}`
    : `${process.env.CLIENT}`;
  return url;
}

function validateUrl(raw: string): string {
  if (typeof raw !== "string") throw new Error("targetUrl must be a string");
  const value = raw.trim();
  if (!value) throw new Error("targetUrl is required");

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("targetUrl must be a valid URL");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("targetUrl must be http(s)");
  }

  return url.toString();
}

export { hashKey, generateMappingKey, baseUrl, validateUrl };
