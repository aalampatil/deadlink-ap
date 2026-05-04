export type SocialPlatform =
  | "linkedin"
  | "x"
  | "github"
  | "youtube"
  | "instagram"
  | "portfolio"
  | "email"
  | "custom";

export const socialPlatformLabels: Record<SocialPlatform, string> = {
  linkedin: "LinkedIn",
  x: "X",
  github: "GitHub",
  youtube: "YouTube",
  instagram: "Instagram",
  portfolio: "Portfolio",
  email: "Email",
  custom: "Link",
};

export const normalizeSocialPlatform = (
  platform?: string,
  label?: string,
): SocialPlatform => {
  const normalizedPlatform = platform?.toLowerCase();
  if (
    normalizedPlatform === "linkedin" ||
    normalizedPlatform === "x" ||
    normalizedPlatform === "github" ||
    normalizedPlatform === "youtube" ||
    normalizedPlatform === "instagram" ||
    normalizedPlatform === "portfolio" ||
    normalizedPlatform === "email"
  ) {
    return normalizedPlatform;
  }

  const normalizedLabel = label?.toLowerCase();
  if (normalizedLabel?.includes("linkedin")) return "linkedin";
  if (normalizedLabel === "x" || normalizedLabel?.includes("twitter")) return "x";
  if (normalizedLabel?.includes("github")) return "github";
  if (normalizedLabel?.includes("youtube")) return "youtube";
  if (normalizedLabel?.includes("instagram")) return "instagram";
  if (normalizedLabel?.includes("portfolio")) return "portfolio";
  if (normalizedLabel?.includes("email")) return "email";

  return "custom";
};
