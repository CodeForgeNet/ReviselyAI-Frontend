import axios from "axios";
import { getAuth } from "firebase/auth";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`[Axios] Request to ${config.url} with auth token`);
  } else {
    console.warn(
      `[Axios] Request to ${config.url} WITHOUT auth token - user not logged in`
    );
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error(
        "[Axios] 401 Unauthorized - Token may be expired or invalid"
      );
    }
    return Promise.reject(error);
  }
);

export default instance;
