import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosApi } from "@/config/axiosApi";

type AxiosErrorResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export type SocialCardLink = {
  label: string;
  url: string;
  type?: "social" | "project";
  platform?: string;
  description?: string;
};

export type SocialCard = {
  id: string;
  slug: string;
  displayName: string;
  displayNameColor?: string;
  bio: string;
  bioColor?: string;
  avatarUrl: string;
  backgroundImageUrl: string;
  accentColor: string;
  links: SocialCardLink[];
  publicUrl: string;
  createdAt: string;
  updatedAt: string;
};

type SocialCardResponse = SocialCard & {
  display_name_color?: string;
  bio_color?: string;
};

const normalizeCard = (card: SocialCardResponse | null): SocialCard | null => {
  if (!card) return null;

  return {
    ...card,
    displayNameColor:
      card.displayNameColor ?? card.display_name_color ?? "#000000",
    bio: card.bio.toUpperCase(),
    bioColor: card.bioColor ?? card.bio_color ?? "#111111",
  };
};

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error && "response" in err
    ? (err as AxiosErrorResponse).response?.data?.message ?? fallback
    : fallback;

type CardEditorStore = {
  card: SocialCard | null;
  loading: boolean;
  saving: boolean;
  fetchMyCard: () => Promise<SocialCard | null>;
  saveCard: (payload: Omit<SocialCard, "id" | "publicUrl" | "createdAt" | "updatedAt">) => Promise<boolean>;
};

export const useCardEditorStore = create<CardEditorStore>((set) => ({
  card: null,
  loading: false,
  saving: false,

  fetchMyCard: async () => {
    try {
      set({ loading: true });
      const res = await axiosApi.get("/card/me");
      const card = normalizeCard(res.data.data);
      set({ card });
      return card;
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to fetch card"));
      return null;
    } finally {
      set({ loading: false });
    }
  },

  saveCard: async (payload) => {
    try {
      set({ saving: true });
      const res = await axiosApi.put("/card/me", payload);
      set({ card: normalizeCard(res.data.data) });
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save card"));
      return false;
    } finally {
      set({ saving: false });
    }
  },
}));

type PublicCardStore = {
  card: SocialCard | null;
  loading: boolean;
  fetchPublicCard: (slug: string) => Promise<void>;
};

export const usePublicCardStore = create<PublicCardStore>((set) => ({
  card: null,
  loading: false,

  fetchPublicCard: async (slug) => {
    try {
      set({ loading: true, card: null });
      const res = await axiosApi.get(`/card/public/${slug}`);
      set({ card: normalizeCard(res.data.data) });
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to fetch card"));
    } finally {
      set({ loading: false });
    }
  },
}));
