import axios from "axios";

const backendUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_BACKEND
    : import.meta.env.VITE_SERVER;
export const axiosApi = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

export const attachTokenInterceptor = (
  getToken: () => Promise<string | null>,
) => {
  return axiosApi.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
};

export default axiosApi;
