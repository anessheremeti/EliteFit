/**
 * Shared refresh-token state and helpers.
 * Both axiosClient.js and adminApi.js import from here so that a single
 * in-flight refresh is shared across both axios instances — prevents duplicate
 * refresh calls when multiple 401s arrive at the same time.
 */
import axios from 'axios';

const API_BASE = 'https://localhost:7049/api';

// ── Shared refresh state ─────────────────────────────────────────────────────

let _isRefreshing = false;
let _failedQueue  = [];       // { resolve, reject }[]

export const isRefreshing  = () => _isRefreshing;
export const setRefreshing = (v) => { _isRefreshing = v; };

export const enqueue = () =>
  new Promise((resolve, reject) => _failedQueue.push({ resolve, reject }));

export const flushQueue = (error, token = null) => {
  _failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  _failedQueue = [];
};

// ── Auth helpers ──────────────────────────────────────────────────────────────

export const getToken        = () => localStorage.getItem('token')?.replace(/"/g, '').trim() ?? null;
export const getRefreshToken = () => localStorage.getItem('refreshToken') ?? null;

export const storeTokens = (token, refreshToken) => {
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('elitefit_user');
};

export const logout = () => {
  clearTokens();
  window.location.href = '/login';
};

// ── Silent refresh ────────────────────────────────────────────────────────────

/**
 * Sends the stored refresh token to the backend, stores the new pair, and
 * returns the new access token.  Throws if the refresh fails (caller should
 * then call logout()).
 */
export const doRefresh = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token stored.');

  // Use a plain axios call (not the intercepted instances) to avoid loops.
  const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
  storeTokens(data.token, data.refreshToken);
  return data.token;
};
