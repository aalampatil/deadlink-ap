import { Globe, Mail } from "lucide-react";
import { normalizeSocialPlatform } from "./socialPlatforms";

type SocialBrandLogoProps = {
  platform?: string;
  label?: string;
  className?: string;
};

export const SocialBrandLogo = ({
  platform,
  label,
  className = "h-5 w-5",
}: SocialBrandLogoProps) => {
  const normalized = normalizeSocialPlatform(platform, label);

  if (normalized === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <rect width="24" height="24" rx="4" fill="#0A66C2" />
        <path
          fill="#fff"
          d="M6.94 8.9H3.83v10.01h3.11V8.9ZM5.38 7.53c1 0 1.8-.81 1.8-1.8 0-1-.8-1.81-1.8-1.81s-1.8.81-1.8 1.81c0 .99.8 1.8 1.8 1.8Zm13.5 6.3c0-3.07-1.64-4.5-3.83-4.5-1.77 0-2.56.97-3 1.66V8.9H9.07v10.01h3.1v-4.95c0-1.3.25-2.55 1.85-2.55 1.58 0 1.6 1.48 1.6 2.64v4.86h3.26v-5.08Z"
        />
      </svg>
    );
  }

  if (normalized === "x") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <rect width="24" height="24" rx="4" fill="#000" />
        <path
          fill="#fff"
          d="M14.3 10.16 22.12 1h-1.85l-6.79 7.95L8.06 1H1.8l8.2 12.03L1.8 22.65h1.85l7.17-8.4 5.73 8.4h6.26l-8.52-12.49Zm-2.54 2.98-.83-1.2-6.61-9.53h2.85l5.33 7.69.83 1.2 6.94 10.01h-2.85l-5.66-8.17Z"
        />
      </svg>
    );
  }

  if (normalized === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path
          fill="#181717"
          d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.11.79-.25.79-.56v-2.02c-3.22.7-3.9-1.38-3.9-1.38-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.11-.75.41-1.26.74-1.55-2.57-.29-5.28-1.29-5.28-5.73 0-1.27.46-2.3 1.2-3.12-.12-.29-.52-1.48.11-3.08 0 0 .97-.31 3.18 1.19A11.1 11.1 0 0 1 12 6.01c.98 0 1.96.13 2.88.39 2.2-1.5 3.18-1.19 3.18-1.19.63 1.6.23 2.79.11 3.08.75.82 1.2 1.85 1.2 3.12 0 4.46-2.71 5.43-5.3 5.72.42.36.8 1.08.8 2.18v3.23c0 .31.2.68.8.56A11.5 11.5 0 0 0 12 .5Z"
        />
      </svg>
    );
  }

  if (normalized === "youtube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path
          fill="#FF0000"
          d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.55 3.58 12 3.58 12 3.58s-7.55 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.85.5 9.4.5 9.4.5s7.55 0 9.4-.5a3 3 0 0 0 2.1-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8Z"
        />
        <path fill="#fff" d="M9.55 15.57 15.82 12 9.55 8.43v7.14Z" />
      </svg>
    );
  }

  if (normalized === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <defs>
          <linearGradient id="instagram-gradient" x1="3" x2="21" y1="21" y2="3">
            <stop offset="0" stopColor="#FEDA75" />
            <stop offset=".35" stopColor="#FA7E1E" />
            <stop offset=".65" stopColor="#D62976" />
            <stop offset="1" stopColor="#4F5BD5" />
          </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#instagram-gradient)" />
        <path
          fill="#fff"
          d="M12 7.1a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8Zm0 8.08a3.18 3.18 0 1 1 0-6.36 3.18 3.18 0 0 1 0 6.36Zm6.24-8.27a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z"
        />
        <path
          fill="#fff"
          d="M17.06 3.8H6.94A3.15 3.15 0 0 0 3.8 6.94v10.12a3.15 3.15 0 0 0 3.14 3.14h10.12a3.15 3.15 0 0 0 3.14-3.14V6.94a3.15 3.15 0 0 0-3.14-3.14Zm1.4 13.26c0 .77-.63 1.4-1.4 1.4H6.94c-.77 0-1.4-.63-1.4-1.4V6.94c0-.77.63-1.4 1.4-1.4h10.12c.77 0 1.4.63 1.4 1.4v10.12Z"
        />
      </svg>
    );
  }

  if (normalized === "email") return <Mail aria-hidden="true" className={className} />;
  if (normalized === "portfolio") return <Globe aria-hidden="true" className={className} />;

  return <Globe aria-hidden="true" className={className} />;
};
