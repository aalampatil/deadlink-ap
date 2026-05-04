import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Copy,
  Eye,
  Palette,
  Plus,
  Save,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialBrandLogo } from "@/components/SocialBrandLogo";
import { type SocialPlatform } from "@/components/socialPlatforms";
import {
  type SocialCardLink,
  useCardEditorStore,
} from "@/store/CardStore";

type SocialPreset = {
  key: SocialPlatform;
  label: string;
  placeholder: string;
};

const socialPresets: SocialPreset[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/username",
  },
  {
    key: "x",
    label: "X",
    placeholder: "https://x.com/username",
  },
  {
    key: "github",
    label: "GitHub",
    placeholder: "https://github.com/username",
  },
  {
    key: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@username",
  },
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/username",
  },
  {
    key: "portfolio",
    label: "Portfolio",
    placeholder: "https://your-site.com",
  },
  {
    key: "email",
    label: "Email",
    placeholder: "https://mail.google.com/mail/?view=cm&to=you@example.com",
  },
];

const emptyProject = (): SocialCardLink => ({
  label: "",
  url: "",
  description: "",
  type: "project",
  platform: "custom",
});

const defaultBioColor = "#111111";
const defaultDisplayNameColor = "#000000";
const accentPresets = ["#facc00", "#00d696", "#7a83ff", "#ff4d50", "#0099ff"];
const displayNameColorPresets = [
  defaultDisplayNameColor,
  "#ffffff",
  "#facc00",
  "#00d696",
  "#0099ff",
];
const bioColorPresets = [defaultBioColor, "#ffffff", "#facc00", "#00d696", "#0099ff"];
const maxProjectCount = 5;

const isLocalOrigin = (origin: string) =>
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(origin);

const CardEditorPage = () => {
  const { card, loading, saving, fetchMyCard, saveCard } = useCardEditorStore();
  const { isLoaded, isSignedIn } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [displayNameColor, setDisplayNameColor] = useState(
    defaultDisplayNameColor,
  );
  const [slug, setSlug] = useState("");
  const [bio, setBio] = useState("");
  const [bioColor, setBioColor] = useState(defaultBioColor);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [accentColor, setAccentColor] = useState("#facc00");
  const [socialLinks, setSocialLinks] = useState<SocialCardLink[]>(
    socialPresets.map((preset) => ({
      label: preset.label,
      url: "",
      type: "social",
      platform: preset.key,
    })),
  );
  const [projects, setProjects] = useState<SocialCardLink[]>([emptyProject()]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const loadCard = async () => {
      const nextCard = await fetchMyCard();
      if (!nextCard) return;

      const savedSocials = nextCard.links.filter(
        (link) => link.type !== "project",
      );
      const savedProjects = nextCard.links.filter(
        (link) => link.type === "project",
      );

      setDisplayName(nextCard.displayName);
      setDisplayNameColor(
        nextCard.displayNameColor || defaultDisplayNameColor,
      );
      setSlug(nextCard.slug);
      setBio(nextCard.bio.toUpperCase());
      setBioColor(nextCard.bioColor || defaultBioColor);
      setAvatarUrl(nextCard.avatarUrl);
      setBackgroundImageUrl(nextCard.backgroundImageUrl);
      setAccentColor(nextCard.accentColor);
      setSocialLinks(
        socialPresets.map((preset) => {
          const saved = savedSocials.find(
            (link) =>
              link.platform === preset.key ||
              link.label.toLowerCase() === preset.label.toLowerCase(),
          );

          return {
            label: preset.label,
            url: saved?.url ?? "",
            type: "social",
            platform: preset.key,
          };
        }),
      );
      setProjects(
        savedProjects.length
          ? savedProjects.slice(0, maxProjectCount)
          : [emptyProject()],
      );
    };

    void loadCard();
  }, [fetchMyCard, isLoaded, isSignedIn]);

  const previewSocials = useMemo(
    () => socialLinks.filter((link) => link.url.trim()),
    [socialLinks],
  );

  const previewProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.label.trim() ||
          project.url.trim() ||
          project.description?.trim(),
      ),
    [projects],
  );

  const updateSocialLink = (platform: SocialPlatform, url: string) => {
    setSocialLinks((current) =>
      current.map((link) =>
        link.platform === platform ? { ...link, url } : link,
      ),
    );
  };

  const updateProject = (
    index: number,
    field: keyof SocialCardLink,
    value: string,
  ) => {
    setProjects((current) =>
      current.map((project, itemIndex) =>
        itemIndex === index ? { ...project, [field]: value } : project,
      ),
    );
  };

  const addProject = () => {
    setProjects((current) =>
      current.length >= maxProjectCount
        ? current
        : [...current, emptyProject()],
    );
  };

  const removeProject = (index: number) => {
    setProjects((current) =>
      current.length === 1
        ? [emptyProject()]
        : current.filter((_, i) => i !== index),
    );
  };

  const handleSave = async () => {
    const cleanedSocials = previewSocials.map((link) => ({
      label: link.label,
      url: link.url.trim(),
      type: "social" as const,
      platform: link.platform,
      description: "",
    }));

    const cleanedProjects = previewProjects
      .filter((project) => project.label.trim() && project.url.trim())
      .map((project) => ({
        label: project.label.trim(),
        url: project.url.trim(),
        description: project.description?.trim() ?? "",
        type: "project" as const,
        platform: "custom",
      }));

    const saved = await saveCard({
      displayName,
      displayNameColor,
      slug,
      bio: bio.toUpperCase(),
      bioColor,
      avatarUrl,
      backgroundImageUrl,
      accentColor,
      links: [...cleanedSocials, ...cleanedProjects],
    });

    if (saved) toast.success("Card saved");
  };

  const copyPublicUrl = async () => {
    const publicUrl = getPublicCardUrl();
    if (!publicUrl) return;
    await navigator.clipboard.writeText(publicUrl);
    toast.success("Copied card URL");
  };

  const openPublicCard = () => {
    const publicUrl = getPublicCardUrl();
    if (!publicUrl) return;
    window.open(publicUrl, "_blank", "noopener,noreferrer");
  };

  const getPublicCardUrl = () => {
    if (!card?.slug) return card?.publicUrl ?? "";

    if (isLocalOrigin(window.location.origin)) {
      return `${window.location.origin}/c/${card.slug}`;
    }

    return card.publicUrl;
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <main className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_430px]">
        <section className="border-4 border-border bg-secondary-background shadow-shadow">
          <div className="flex flex-col gap-4 border-b-4 border-border bg-main p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 border-2 border-border bg-secondary-background px-3 py-1 text-xs font-heading shadow-shadow">
                <Sparkles size={14} />
                Public profile builder
              </div>
              <h1 className="text-2xl font-heading sm:text-4xl">Social Card</h1>
              <p className="mt-1 max-w-2xl text-sm sm:text-base">
                Build one sharp card for socials, best work, and your public profile.
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
                  onChange={(e) => setBio(e.target.value.toUpperCase())}
                  maxLength={280}
                  placeholder="DEVELOPER, BUILDER, STUDENT. I SHIP USEFUL WEB TOOLS."
                  className="min-h-24 resize-none border-2 border-border bg-white p-3 font-sans text-sm outline-none shadow-shadow"
                />
              </label>

              <div className="grid gap-4 xl:grid-cols-2">
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
              </div>

              <div className="grid gap-4 border-2 border-border bg-main p-4 shadow-shadow xl:grid-cols-3">
                <div className="flex flex-col gap-3">
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
                        className={`h-10 w-10 border-2 border-border shadow-shadow transition-transform ${
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
                  <div className="flex items-center gap-2 font-heading">
                    <Palette size={18} />
                    Name color
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {displayNameColorPresets.map((color) => (
                      <button
                        key={color}
                        type="button"
                        aria-label={`Use ${color}`}
                        onClick={() => setDisplayNameColor(color)}
                        className={`h-10 w-10 border-2 border-border shadow-shadow transition-transform ${
                          displayNameColor === color ? "-translate-x-1 -translate-y-1" : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input
                      type="color"
                      value={displayNameColor || defaultDisplayNameColor}
                      onChange={(e) => setDisplayNameColor(e.target.value)}
                      className="h-10 w-20 border-2 border-border bg-white shadow-shadow"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 font-heading">
                    <Palette size={18} />
                    Bio color
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {bioColorPresets.map((color) => (
                      <button
                        key={color}
                        type="button"
                        aria-label={`Use ${color}`}
                        onClick={() => setBioColor(color)}
                        className={`h-10 w-10 border-2 border-border shadow-shadow transition-transform ${
                          bioColor === color ? "-translate-x-1 -translate-y-1" : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input
                      type="color"
                      value={bioColor || defaultBioColor}
                      onChange={(e) => setBioColor(e.target.value)}
                      className="h-10 w-20 border-2 border-border bg-white shadow-shadow"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-heading">Preset Social Links</h2>
                  <span className="border-2 border-border bg-main px-2 py-1 text-xs font-heading shadow-shadow">
                    Logo ready
                  </span>
                </div>

                <div className="grid gap-3 xl:grid-cols-2">
                  {socialPresets.map((preset) => (
                    <label
                      key={preset.key}
                      className="grid grid-cols-[44px_1fr] gap-3 border-2 border-border bg-main p-3 shadow-shadow"
                    >
                      <span
                        className="flex h-11 w-11 items-center justify-center border-2 border-border bg-secondary-background shadow-shadow"
                        title={preset.label}
                      >
                        <SocialBrandLogo
                          platform={preset.key}
                          label={preset.label}
                          className="h-6 w-6"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="mb-1 block font-heading text-sm">
                          {preset.label}
                        </span>
                        <Input
                          value={
                            socialLinks.find(
                              (link) => link.platform === preset.key,
                            )?.url ?? ""
                          }
                          onChange={(e) =>
                            updateSocialLink(preset.key, e.target.value)
                          }
                          placeholder={preset.placeholder}
                          className="rounded-none border-2 border-border bg-white font-sans"
                        />
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-heading">Featured Projects</h2>
                  <Button
                    onClick={addProject}
                    disabled={projects.length >= maxProjectCount}
                    className="rounded-none border-2 border-border bg-secondary-background shadow-shadow"
                  >
                    <Plus size={16} />
                    Add
                  </Button>
                </div>

                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="grid gap-3 border-2 border-border bg-main p-3 shadow-shadow"
                  >
                    <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                      <Input
                        value={project.label}
                        onChange={(e) =>
                          updateProject(index, "label", e.target.value)
                        }
                        placeholder="Project name"
                        className="rounded-none border-2 border-border bg-white"
                      />
                      <Input
                        value={project.url}
                        onChange={(e) =>
                          updateProject(index, "url", e.target.value)
                        }
                        placeholder="https://project-demo.com"
                        className="rounded-none border-2 border-border bg-white"
                      />
                      <Button
                        onClick={() => removeProject(index)}
                        className="rounded-none border-2 border-border bg-white text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    <textarea
                      value={project.description ?? ""}
                      onChange={(e) =>
                        updateProject(index, "description", e.target.value)
                      }
                      maxLength={140}
                      placeholder="One tight line about why this work matters."
                      className="min-h-20 resize-none border-2 border-border bg-white p-3 text-sm outline-none"
                    />
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
              className="relative mx-auto flex min-h-[660px] max-w-sm flex-col overflow-hidden border-4 border-border bg-secondary-background text-left"
              style={{
                ...(backgroundImageUrl.trim()
                  ? {
                      backgroundImage: `url("${backgroundImageUrl.trim()}")`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }
                  : {}),
              }}
            >
              <div className="flex flex-col items-center gap-4 p-5 text-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="h-28 w-28 rounded-full border-4 border-border bg-white object-cover shadow-shadow"
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
                  <h2
                    className="break-words text-3xl font-heading"
                    style={{ color: displayNameColor || defaultDisplayNameColor }}
                  >
                    {displayName || "Your Name"}
                  </h2>
                  <p
                    className="mt-2 break-words text-lg leading-8"
                    style={{
                      color: bioColor || defaultBioColor,
                      textTransform: "uppercase",
                    }}
                  >
                    {bio || "YOUR SHORT BIO APPEARS HERE."}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {previewSocials.length ? (
                    previewSocials.map((link) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-11 w-11 items-center justify-center border-2 border-border bg-white shadow-shadow transition-transform hover:-translate-y-1"
                        title={link.label}
                      >
                        <SocialBrandLogo
                          platform={link.platform}
                          label={link.label}
                          className="h-6 w-6"
                        />
                      </a>
                    ))
                  ) : (
                    <div className="border-2 border-dashed border-border p-3 text-sm">
                      Add social links to preview logos.
                    </div>
                  )}
                </div>

                <div className="flex w-full flex-col gap-3 text-left">
                  <div className="flex items-center justify-center gap-2 font-heading">
                    <Star size={18} fill="currentColor" />
                    Featured work
                  </div>
                  {previewProjects.length ? (
                    previewProjects.map((project, index) => (
                      <a
                        key={`${project.label}-${index}`}
                        href={project.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="group border-2 border-border bg-white p-3 shadow-shadow transition-transform hover:-translate-x-1 hover:-translate-y-1"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="min-w-0 break-words font-heading">
                            {project.label || "Project name"}
                          </span>
                          <ArrowUpRight size={17} className="shrink-0" />
                        </div>
                        <p className="mt-2 break-words text-sm">
                          {project.description || "Short project description."}
                        </p>
                      </a>
                    ))
                  ) : (
                    <div className="border-2 border-dashed border-border p-3 text-sm">
                      Add featured projects to show your best work.
                    </div>
                  )}
                </div>

                <div className="mt-auto flex items-center gap-2 border-2 border-border bg-main px-3 py-2 text-xs font-heading shadow-shadow">
                  <BriefcaseBusiness size={15} />
                  deadlink card
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default CardEditorPage;
