import axios from 'axios';
import {
  getToken, doRefresh, logout,
  isRefreshing, setRefreshing,
  enqueue, flushQueue,
  getRefreshToken,
} from '../utils/tokenManager';

const BASE_URL = 'http://localhost:5193/api';

const apiClient = axios.create({ baseURL: BASE_URL });

// ── Request: attach access token ──────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Let axios set the correct Content-Type + boundary for FormData.
  if (!(config.data instanceof FormData))
    config.headers['Content-Type'] = 'application/json';

  return config;
});

// ── Response: auto-refresh on 401 ────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const original = error.config;
    const serverMessage = error.response?.data?.message || error.response?.data;

    if (error?.response?.status !== 401 || original._retry) {
      return Promise.reject(
        new Error(serverMessage || `Request failed (${error.response?.status ?? 'Network Error'})`)
      );
    }

    if (isRefreshing()) {
      return enqueue().then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return apiClient(original);
      });
    }

    original._retry = true;
    setRefreshing(true);

    try {
      const newToken = await doRefresh();
      flushQueue(null, newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    } catch (refreshError) {
      flushQueue(refreshError);
      logout();
      return Promise.reject(refreshError);
    } finally {
      setRefreshing(false);
    }
  }
);

// ── API methods ───────────────────────────────────────────────────────────────
export const adminApi = {
  // ── Auth ───────────────────────────────────────────────────────────────────
  logout: async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try { await apiClient.post('/auth/logout', { refreshToken }); } catch { /* ignore */ }
    }
    logout(); // clear storage + redirect
  },

  // ── Media / Uploads ────────────────────────────────────────────────────────
  uploadFile:     (formData) => apiClient.post('/Files/upload', formData),
  uploadBadgeIcon:(formData) => apiClient.post('/admin/badges/upload-icon', formData),

  // ── Audit Logs ─────────────────────────────────────────────────────────────
  getAuditLogs(params = {}) {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );
    return apiClient.get('/admin/audit-logs', { params: cleanParams });
  },

  // ── Workouts ───────────────────────────────────────────────────────────────
  getWorkouts:   () => apiClient.get('/workouts/videos'),
  createWorkout: (data) => apiClient.post('/workouts/create-video', data),
  updateWorkout: (id, data) => apiClient.put('/workouts/update-video', data),
  deleteWorkout: (id) => apiClient.delete(`/workouts/videos/${id}`),

  // ── Recipes ────────────────────────────────────────────────────────────────
  getRecipes:   () => apiClient.get('/admin/recipes'),
  createRecipe: (data) => apiClient.post('/admin/recipes', data),
  updateRecipe: (id, d) => apiClient.put(`/admin/recipes/${id}`, { id, ...d }),
  deleteRecipe: (id) => apiClient.delete(`/admin/recipes/${id}`),

  // ── Badges ─────────────────────────────────────────────────────────────────
  getBadges:   () => apiClient.get('/admin/badges'),
  createBadge: (data) => apiClient.post('/admin/badges', data),
  updateBadge: (id, d) => apiClient.put(`/admin/badges/${id}`, { id, ...d }),
  deleteBadge: (id) => apiClient.delete(`/admin/badges/${id}`),

  // ── QuickFix Tips ──────────────────────────────────────────────────────────
  getTips:   () => apiClient.get('/admin/quickfix-tips'),
  createTip: (data) => apiClient.post('/admin/quickfix-tips', data),
  updateTip: (id, d) => apiClient.put(`/admin/quickfix-tips/${id}`, { id, ...d }),
  deleteTip: (id) => apiClient.delete(`/admin/quickfix-tips/${id}`),

  // ── Users ──────────────────────────────────────────────────────────────────
  getUsers:           () => apiClient.get('/admin/users'),
  activateUser:     (id) => apiClient.patch(`/admin/users/${id}/activate`),
  deactivateUser:   (id) => apiClient.patch(`/admin/users/${id}/deactivate`),
  assignRoleToUser: (userId, roleId) => apiClient.post(`/admin/users/${userId}/roles/${roleId}`),
  removeRoleFromUser:(userId, roleId) => apiClient.delete(`/admin/users/${userId}/roles/${roleId}`),

  // ── Roles ──────────────────────────────────────────────────────────────────
  getRoles:         () => apiClient.get('/admin/roles'),
  getRoleDetails:   (id) => apiClient.get(`/admin/roles/${id}`),
  createRole:       (data) => apiClient.post('/admin/roles', data),
  updateRole:       (id, data) => apiClient.put(`/admin/roles/${id}`, data),
  deleteRole:       (id) => apiClient.delete(`/admin/roles/${id}`),
  assignPermission: (roleId, permId) => apiClient.post(`/admin/roles/${roleId}/permissions/${permId}`),
  removePermission: (roleId, permId) => apiClient.delete(`/admin/roles/${roleId}/permissions/${permId}`),

  // ── Exercise Categories ────────────────────────────────────────────────────
  getExerciseCategories:     () => apiClient.get('/ExerciseCategories'),
  getExerciseCategoryById:   (id) => apiClient.get(`/ExerciseCategories/${id}`),
  createExerciseCategory:    (data) => apiClient.post('/ExerciseCategories', data),
  updateExerciseCategory:    (id, data) => apiClient.put(`/ExerciseCategories/${id}`, data),
  deleteExerciseCategory:    (id) => apiClient.delete(`/ExerciseCategories/${id}`),
  getExerciseConfigurations: () => apiClient.get('/ExerciseCategories/configurations'),

  // ── Goals ──────────────────────────────────────────────────────────────────
  getGoals:   () => apiClient.get('/Goals'),
  createGoal: (data) => apiClient.post('/Goals', data),
  updateGoal: (id, data) => apiClient.put(`/Goals/${id}`, data),
  deleteGoal: (id) => apiClient.delete(`/Goals/${id}`),

  // ── Permissions ────────────────────────────────────────────────────────────
  getPermissions: () => apiClient.get('/admin/permissions'),

  // ── Settings ───────────────────────────────────────────────────────────────
  getSettings:   () => apiClient.get('/admin/settings'),
  createSetting: (data) => apiClient.post('/admin/settings', data),
  updateSetting: (id, d) => apiClient.put(`/admin/settings/${id}`, { id, ...d }),
  deleteSetting: (id) => apiClient.delete(`/admin/settings/${id}`),
};
