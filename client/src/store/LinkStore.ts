import { create } from "zustand";
import { axiosApi } from "@/config/axiosApi";
import { toast } from "react-toastify";

type AxiosErrorResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

type LinkData = {
  _id: string;
  displayTitle: string;
  slug: string;
  ownerId: string;
  publicUrl: string;
  manageUrl: string;
  mappedOn: string | null;
  mappedUrl: string | null;
  status: boolean | "pending" | "ready";
  createdAt: string;
  updatedAt: string;
};

//#region 1
type GenerateLinkStore = {
  displayTitle: string;
  data: LinkData | null;
  loading: boolean;
  setDisplayTitle: (title: string) => void;
  createLink: () => Promise<void>;
};

export const useGenerateLinkStore = create<GenerateLinkStore>((set, get) => ({
  displayTitle: "",
  data: null,
  loading: false,

  setDisplayTitle: (title) => set({ displayTitle: title }),

  createLink: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const res = await axiosApi.post("/link/create", {
        displayTitle: get().displayTitle,
      });
      set({ data: res.data });
    } catch (err: unknown) {
      const message =
        err instanceof Error && "response" in err
          ? (err as AxiosErrorResponse).response?.data?.message
          : "An error occurred while creating link";
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },
}));
//#endregion

//#region 2

type FetchLinksStore = {
  allLinks: LinkData[] | null;
  loading: boolean;
  setAllLinks: (allLinks: LinkData[]) => void;
  fetchAllLinks: () => Promise<void>;
};

const unwrapLinks = (data: unknown): LinkData[] => {
  if (Array.isArray(data)) return data;
  const obj = data as { links?: unknown; data?: unknown };
  if (Array.isArray(obj?.links)) return obj.links;
  if (Array.isArray(obj?.data)) return obj.data;
  return [];
};

export const useFetchLinksStore = create<FetchLinksStore>((set, get) => ({
  allLinks: null,
  loading: false,
  setAllLinks: (links) => set({ allLinks: links }),
  fetchAllLinks: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const res = await axiosApi.get("/link/get-all");

      set({ allLinks: unwrapLinks(res.data) });
    } finally {
      set({ loading: false });
    }
  },
}));

//#endregion

//#region 3

type ManageLinkStore = {
  data: LinkData | null;
  targetUrl: string;
  loading: boolean;
  fetching: boolean;

  setTargetUrl: (url: string) => void;
  fetchLink: (slug: string) => Promise<void>;
  mapUrl: (slug: string) => Promise<void>;
};

export const useManageLinkStore = create<ManageLinkStore>((set, get) => ({
  data: null,
  targetUrl: "",
  fetching: false,
  loading: false,

  setTargetUrl: (url) => {
    set({ targetUrl: url });
  },

  fetchLink: async (slug) => {
    try {
      set({ fetching: true });
      const res = await axiosApi.get(`/link/manage/${slug}`);
      // console.log("manage link", res);
      set({
        data: res.data,
      });
    } catch (err) {
      const message =
        err instanceof Error && "response" in err
          ? (err as AxiosErrorResponse).response?.data?.message
          : "An error occurred while fetching link";
      toast.error(message);
    } finally {
      set({ fetching: false });
    }
  },

  mapUrl: async (slug) => {
    try {
      set({ loading: true });

      const { targetUrl } = get();

      const res = await axiosApi.post(`/link/${slug}/map`, {
        targetUrl,
      });

      set({
        data: res.data,
        targetUrl: "",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error && "response" in err
          ? (err as AxiosErrorResponse).response?.data?.message
          : "An error occurred while mapping";
      toast.error(message);
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },
}));

//#endregion

//#region 4

type PublicLinkStore = {
  data: LinkData | null;
  isLoading: boolean;
  fetchLink: (slug: string) => Promise<void>;
};

export const usePublicLinkStore = create<PublicLinkStore>((set) => ({
  data: null,
  isLoading: true,
  fetchLink: async (slug) => {
    try {
      const res = await axiosApi.get(`/link/public/${slug}`);
      const link = res.data.mappedUrl;
      if (link) {
        window.location.href = link;
        return;
      }
      set({
        data: res.data,
      });
    } catch (err) {
      const message =
        err instanceof Error && "response" in err
          ? (err as AxiosErrorResponse).response?.data?.message
          : "An error occurred while redirecting";
      set({
        data: null,
      });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },
}));
//#endregion
