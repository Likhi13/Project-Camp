import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let queue = [];

const flushQueue = (error) => {
  queue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  queue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    const isAuthRoute =
      original?.url?.includes("/auth/login") ||
      original?.url?.includes("/auth/register") ||
      original?.url?.includes("/auth/refresh-token") ||
      original?.url?.includes("/auth/current-user");

    // Only try refreshing the token for authenticated API requests.
    if (error.response?.status === 401 && !original?._retry && !isAuthRoute) {
      // If another request is already refreshing the token,
      // wait for it to finish before retrying this request.
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(() => axiosClient(original));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        await axiosClient.post("/auth/refresh-token");

        flushQueue(null);

        // Retry the original request after successful refresh.
        return axiosClient(original);
      } catch (refreshError) {
        flushQueue(refreshError);

        // Do NOT use window.location.href here.
        // AuthContext / React Router should handle redirecting
        // unauthenticated users to /login.
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
