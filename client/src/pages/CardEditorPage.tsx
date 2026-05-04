import { useEffect, useMemo, useState } from "react";
import { Copy, Eye, Palette, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type SocialCardLink,
  useCardEditorStore,
} from "@/store/CardStore";

const emptyLink = (): SocialCardLink => ({ label: "", url: "" });

const accentPresets = ["#facc00", "#00d696", "#7a83ff", "#ff4d50", "#0099ff"];
const backgroundOverlay =
  "linear-gradient(rgba(255,255,255,0.28), rgba(255,255,255,0.42))";

const CardEditorPage = () => {
  const { card, loading, saving, fetchMyCard, saveCard } = useCardEditorStore();
  const [displayName, setDisplayName] = useState("");
  const [slug, setSlug] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [accentColor, setAccentColor] = useState("#facc00");
  const [links, setLinks] = useState<SocialCardLink[]>([emptyLink()]);

  useEffect(() => {
    const loadCard = async () => {
      const nextCard = await fetchMyCard();
      if (!nextCard) return;
      setDisplayName(nextCard.displayName);
      setSlug(nextCard.slug);
      setBio(nextCard.bio);
      setAvatarUrl(nextCard.avatarUrl);
      setBackgroundImageUrl(nextCard.backgroundImageUrl);
      setAccentColor(nextCard.accentColor);
      setLinks(nextCard.links.length ? nextCard.links : [emptyLink()]);
    };

    void loadCard();
  }, [fetchMyCard]);

  const previewLinks = useMemo(
    () => links.filter((link) => link.label.trim() && link.url.trim()),
    [links],
  );

  const updateLink = (
    index: number,
    field: keyof SocialCardLink,
    value: string,
  ) => {
    setLinks((current) =>
      current.map((link, itemIndex) =>
        itemIndex === index ? { ...link, [field]: value } : link,
      ),
    );
  };

  const removeLink = (index: number) => {
    setLinks((current) =>
      current.length === 1 ? [emptyLink()] : current.filter((_, i) => i !== index),
    );
  };

  const handleSave = async () => {
    const saved = await saveCard({
      displayName,
      slug,
      bio,
      avatarUrl,
      backgroundImageUrl,
      accentColor,
      links: previewLinks,
    });

    if (saved) toast.success("Card saved");
  };

  const copyPublicUrl = async () => {
    if (!card?.publicUrl) return;
    await navigator.clipboard.writeText(card.publicUrl);
    toast.success("Copied card URL");
  };

  const openPublicCard = () => {
    if (!card?.publicUrl) return;
    window.open(card.publicUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <main className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="border-4 border-border bg-secondary-background shadow-shadow">
          <div className="flex flex-col gap-4 border-b-4 border-border bg-main p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-heading sm:text-4xl">Social Card</h1>
              <p className="mt-1 max-w-2xl text-sm sm:text-base">
                Build one public card for your profile, work, and socials.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {card?.publicUrl && (
                <>
                  <Button
                    onClick={copyPublicUrl}
                    className="rounded-none border-2 border-border bg-secondary-background shadow-shadow"
                  >
                    <Copy size={16} />
                    Copy URL
                  </Button>
                  <Button
                    onClick={openPublicCard}
                    className="rounded-none border-2 border-border bg-secondary-background shadow-shadow"
                  >
                    <Eye size={16} />
                    Preview
                  </Button>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div className="m-5 border-2 border-border bg-main p-4 shadow-shadow">
              Loading...
            </div>
          ) : (
            <div className="flex flex-col gap-6 p-5">
              <div className="grid gap-4 xl:grid-cols-2">
                <label className="flex flex-col gap-2 font-heading">
                  Display name
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Aalam Patil"
                    className="rounded-none border-2 border-border bg-white font-sans shadow-shadow"
                  />
                </label>
                <label className="flex flex-col gap-2 font-heading">
                  Public slug
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="aalam"
                    className="rounded-none border-2 border-border bg-white font-sans shadow-shadow"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 font-heading">
                Bio
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={280}
                  placeholder="Developer, builder, student."
                  className="min-h-24 resize-none border-2 border-border bg-white p-3 font-sans text-sm outline-none shadow-shadow"
                />
              </label>

              <label className="flex flex-col gap-2 font-heading">
                Avatar image URL
                <Input
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="rounded-none border-2 border-border bg-white font-sans shadow-shadow"
                />
              </label>

              <label className="flex flex-col gap-2 font-heading">
                Background image URL
                <Input
                  value={backgroundImageUrl}
                  onChange={(e) => setBackgroundImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="rounded-none border-2 border-border bg-white font-sans shadow-shadow"
                />
              </label>

              <div className="flex flex-col gap-3 border-2 border-border bg-main p-4 shadow-shadow">
                <div className="flex items-center gap-2 font-heading">
                  <Palette size={18} />
                  Accent color
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {accentPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={`Use ${color}`}
                      onClick={() => setAccentColor(color)}
                      className={`h-10 w-10 border-2 border-border shadow-shadow ${
                        accentColor === color ? "-translate-x-1 -translate-y-1" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-10 w-20 border-2 border-border bg-white shadow-shadow"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-heading">Social Links</h2>
                  <Button
                    onClick={() =>
                      setLinks((current) =>
                        current.length >= 10 ? current : [...current, emptyLink()],
                      )
                    }
                    disabled={links.length >= 10}
                    className="rounded-none border-2 border-border bg-secondary-background shadow-shadow"
                  >
                    <Plus size={16} />
                    Add
                  </Button>
                </div>

                {links.map((link, index) => (
                  <div
                    key={index}
                    className="grid gap-2 border-2 border-border bg-main p-3 shadow-shadow sm:grid-cols-[1fr_2fr_auto]"
                  >
                    <Input
                      value={link.label}
                      onChange={(e) => updateLink(index, "label", e.target.value)}
                      placeholder="Instagram"
                      className="rounded-none border-2 border-border bg-white"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => updateLink(index, "url", e.target.value)}
                      placeholder="https://instagram.com/username"
                      className="rounded-none border-2 border-border bg-white"
                    />
                    <Button
                      onClick={() => removeLink(index)}
                      className="rounded-none border-2 border-border bg-white text-red-600 hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                size="lg"
                className="w-fit rounded-none border-2 border-border bg-main text-lg shadow-shadow"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Card"}
              </Button>
            </div>
          )}
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="border-4 border-border bg-main p-3 shadow-shadow">
            <div className="mb-3 flex items-center justify-between border-2 border-border bg-secondary-background px-3 py-2 font-heading">
              <span>Live Preview</span>
              <span className="text-xs">/c/{slug || "your-slug"}</span>
            </div>

            <div
              className="relative mx-auto flex min-h-[620px] max-w-sm flex-col items-center gap-4 overflow-hidden border-4 border-border bg-secondary-background p-6 text-center"
              style={
                backgroundImageUrl.trim()
                  ? {
                      backgroundImage: `${backgroundOverlay}, url("${backgroundImageUrl.trim()}")`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }
                  : undefined
              }
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className="h-28 w-28 rounded-full border-4 border-border object-cover shadow-shadow"
                />
              ) : (
                <div
                  className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-border font-heading text-4xl shadow-shadow"
                  style={{ backgroundColor: accentColor }}
                >
                  {displayName.trim().charAt(0).toUpperCase() || "D"}
                </div>
              )}
              <div>
                <h2 className="break-words text-3xl font-heading">
                  {displayName || "Your Name"}
                </h2>
                <p className="mt-2 break-words text-sm">
                  {bio || "Your short bio appears here."}
                </p>
              </div>

              <div className="mt-2 flex w-full flex-col gap-3">
                {previewLinks.length ? (
                  previewLinks.map((link, index) => (
                    <a
                      key={`${link.label}-${index}`}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full border-2 border-border px-4 py-3 font-heading shadow-shadow transition-transform hover:-translate-x-1 hover:-translate-y-1"
                      style={{ backgroundColor: accentColor }}
                    >
                      {link.label}
                    </a>
                  ))
                ) : (
                  <div className="border-2 border-dashed border-border p-4 text-sm">
                    Add links to preview your card.
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default CardEditorPage;
