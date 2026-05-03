import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { usePublicCardStore } from "@/store/CardStore";

const pageOverlay =
  "linear-gradient(rgba(253,247,196,0.12), rgba(253,247,196,0.32))";
const cardOverlay =
  "linear-gradient(rgba(255,255,255,0.26), rgba(255,255,255,0.42))";

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
          : undefined
      }
    >
      <main className="mx-auto max-w-lg border-4 border-border bg-main p-3 shadow-shadow">
        <div
          className="border-4 border-border bg-secondary-background p-6 text-center"
          style={
            card.backgroundImageUrl.trim()
              ? {
                  backgroundImage: `${cardOverlay}, url("${card.backgroundImageUrl.trim()}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }
              : undefined
          }
        >
          <div className="flex flex-col items-center gap-4">
            {card.avatarUrl ? (
              <img
                src={card.avatarUrl}
                alt=""
                className="h-32 w-32 rounded-full border-4 border-border object-cover shadow-shadow"
              />
            ) : (
              <div
                className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-border font-heading text-5xl shadow-shadow"
                style={{ backgroundColor: card.accentColor }}
              >
                {card.displayName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="max-w-sm">
              <h1 className="break-words text-4xl font-heading">
                {card.displayName}
              </h1>
              {card.bio && <p className="mt-3 break-words text-base">{card.bio}</p>}
            </div>

            <div className="mt-3 flex w-full flex-col gap-3">
              {card.links.length ? (
                card.links.map((link, index) => (
                  <a
                    key={`${link.label}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-between gap-3 border-2 border-border px-4 py-3 text-left font-heading shadow-shadow transition-transform hover:-translate-x-1 hover:-translate-y-1"
                    style={{ backgroundColor: card.accentColor }}
                  >
                    <span className="min-w-0 break-words">{link.label}</span>
                    <ExternalLink size={16} className="shrink-0" />
                  </a>
                ))
              ) : (
                <div className="border-2 border-dashed border-border p-4 text-sm">
                  No links published yet.
                </div>
              )}
            </div>

            <p className="mt-3 border-2 border-border bg-main px-3 py-2 text-xs font-heading">
              deadlink card
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicCardPage;
