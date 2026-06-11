import axios from 'axios';
import {
  getToken, doRefresh, logout,
  isRefreshing, setRefreshing,
  enqueue, flushQueue,
} from '../utils/tokenManager';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5193/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: false,
});

// ── Request: attach access token ─────────────────────────────────────────────
axiosClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response: auto-refresh on 401 ────────────────────────────────────────────
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const original = error.config;

    if (error?.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Another refresh is already in flight — queue this request.
    if (isRefreshing()) {
      return enqueue().then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return axiosClient(original);
      });
    }

    original._retry = true;
    setRefreshing(true);

    try {
      const newToken = await doRefresh();
      flushQueue(null, newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosClient(original);
    } catch (refreshError) {
      flushQueue(refreshError);
      logout();
      return Promise.reject(refreshError);
    } finally {
      setRefreshing(false);
    }
  }
);

export default axiosClient;
