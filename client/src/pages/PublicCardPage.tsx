import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Star,
} from "lucide-react";
import { SocialBrandLogo } from "@/components/SocialBrandLogo";
import {
  normalizeSocialPlatform,
  socialPlatformLabels,
} from "@/components/socialPlatforms";
import { usePublicCardStore } from "@/store/CardStore";

const defaultBioColor = "#111111";
const defaultDisplayNameColor = "#000000";
const pageOverlay =
  "linear-gradient(135deg, rgba(231,247,207,0.72), rgba(0,153,255,0.16), rgba(250,204,0,0.24))";

const PublicCardPage = () => {
  const { slug } = useParams();
  const { card, loading, fetchPublicCard } = usePublicCardStore();

  useEffect(() => {
    if (slug) fetchPublicCard(slug);
  }, [slug, fetchPublicCard]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-4 border-border bg-secondary-background px-6 py-4 font-heading shadow-shadow">
          Loading...
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-4 border-border bg-secondary-background px-6 py-4 font-heading shadow-shadow">
          Card not found
        </div>
      </div>
    );
  }

  const projects = card.links.filter(
    (link) =>
      link.type === "project" ||
      (link.platform === "custom" && Boolean(link.description?.trim())),
  );
  const socials = card.links.filter((link) => !projects.includes(link));

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={
        card.backgroundImageUrl.trim()
          ? {
              backgroundImage: `${pageOverlay}, url("${card.backgroundImageUrl.trim()}")`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }
          : { backgroundImage: pageOverlay }
      }
    >
      <main className="mx-auto max-w-xl border-4 border-border bg-main p-3 shadow-shadow">
        <div
          className="overflow-hidden border-4 border-border bg-secondary-background text-left"
          style={{
            ...(card.backgroundImageUrl.trim()
              ? {
                  backgroundImage: `url("${card.backgroundImageUrl.trim()}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }
              : {}),
          }}
        >
          <div className="flex flex-col items-center gap-5 p-5 text-center sm:p-6">
            <div className="flex flex-col items-center gap-4">
              {card.avatarUrl ? (
                <img
                  src={card.avatarUrl}
                  alt=""
                  className="h-32 w-32 rounded-full border-4 border-border bg-white object-cover shadow-shadow"
                />
              ) : (
                <div
                  className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-border font-heading text-5xl shadow-shadow"
                  style={{ backgroundColor: card.accentColor }}
                >
                  {card.displayName.charAt(0).toUpperCase()}
                </div>
              )}

              <p
                className="w-fit border-2 border-border px-3 py-2 text-xs font-heading shadow-shadow"
                style={{ backgroundColor: card.accentColor }}
              >
                deadlink card
              </p>
            </div>

            <div>
              <h1
                className="break-words text-4xl font-heading sm:text-5xl"
                style={{
                  color: card.displayNameColor || defaultDisplayNameColor,
                }}
              >
                {card.displayName}
              </h1>
              {card.bio && (
                <p
                  className="mt-3 max-w-prose break-words text-xl leading-9"
                  style={{
                    color: card.bioColor || defaultBioColor,
                    textTransform: "uppercase",
                  }}
                >
                  {card.bio.toUpperCase()}
                </p>
              )}
            </div>

            {socials.length ? (
              <div className="flex flex-wrap justify-center gap-2">
                {socials.map((link, index) => (
                  <a
                    key={`${link.label}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-12 w-12 items-center justify-center border-2 border-border bg-white shadow-shadow transition-transform hover:-translate-x-1 hover:-translate-y-1"
                    title={
                      socialPlatformLabels[
                        normalizeSocialPlatform(link.platform, link.label)
                      ]
                    }
                    aria-label={
                      socialPlatformLabels[
                        normalizeSocialPlatform(link.platform, link.label)
                      ]
                    }
                  >
                    <SocialBrandLogo
                      platform={link.platform}
                      label={link.label}
                      className="h-6 w-6"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-border p-4 text-sm">
                No social links published yet.
              </div>
            )}

            {projects.length ? (
              <section className="flex w-full flex-col gap-3 text-left">
                <div className="flex items-center justify-center gap-2 font-heading">
                  <Star size={18} fill="currentColor" />
                  Featured work
                </div>

                <div className="grid gap-3">
                  {projects.map((project, index) => (
                    <div
                      key={`${project.label}-${index}`}
                      className="group border-2 border-border bg-white p-4 shadow-shadow transition-transform hover:-translate-x-1 hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="min-w-0 break-words text-lg font-heading">
                          {project.label}
                        </span>
                        {project.url ? (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open ${project.label}`}
                            className="shrink-0"
                          >
                            <ArrowUpRight size={18} />
                          </a>
                        ) : null}
                      </div>
                      {project.description && (
                        <p className="mt-2 break-words text-sm">
                          {project.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <div
              className="flex items-center gap-2 border-2 border-border px-3 py-2 text-xs font-heading shadow-shadow"
              style={{ backgroundColor: card.accentColor }}
            >
              <BriefcaseBusiness size={15} />
              /c/{card.slug}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicCardPage;
