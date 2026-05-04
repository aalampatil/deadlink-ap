const isLocalOrigin = (origin: string) =>
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(origin);

export const linkPublicUrl = (slug: string, savedUrl?: string | null) => {
  if (isLocalOrigin(window.location.origin)) {
    return `${window.location.origin}/l/${slug}`;
  }

  return savedUrl || `${window.location.origin}/l/${slug}`;
};

export const linkManageUrl = (slug: string, savedUrl?: string | null) => {
  if (isLocalOrigin(window.location.origin)) {
    return `${window.location.origin}/manage/${encodeURIComponent(slug)}`;
  }

  return savedUrl || `${window.location.origin}/manage/${encodeURIComponent(slug)}`;
};
