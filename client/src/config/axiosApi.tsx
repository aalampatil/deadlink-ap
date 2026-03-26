import axios from "axios";

const backendUrl = import.meta.env.MODE === "development" ? import.meta.env.VITE_BACKEND : import.meta.env.VITE_SERVER

export const axiosApi = axios.create({ baseURL: backendUrl })