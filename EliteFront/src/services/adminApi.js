import axios from 'axios';

const BASE_URL = 'https://localhost:7049/api';

// 1. Krijimi i një instance të Axios
const apiClient = axios.create({
  baseURL: BASE_URL,
});

// 2. Interceptor për të shtuar Token-in automatikisht në çdo kërkesë
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // RËNDËSISHME: Nëse dërgojmë FormData (p.sh. video ose foto), Axios e vendos vetë 
    // 'multipart/form-data' dhe boundary-n e saktë. Nuk duhet ta detyrojmë 'application/json' nëse është FormData.
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor për menaxhimin e gabimeve (Error Handling)
apiClient.interceptors.response.use(
  (response) => response.data, // Kthen direkt të dhënat (nuk ka nevojë për .json() ose .text())
  (error) => {
    const serverMessage = error.response?.data?.message || error.response?.data;
    const errorMessage = serverMessage || `Request failed (${error.response?.status || 'Network Error'})`;
    return Promise.reject(new Error(errorMessage));
  }
);

// 4. Objektet e API-ve të konvertuara
export const adminApi = {
  // ── Media / Uploads ────────────────────────────────────────────────────────
  // RREGULLIMI: U ndryshua rruga në '/Files/upload' për t'u përputhur me FilesController tuaj
  uploadFile: (formData) => apiClient.post('/Files/upload', formData), 

  // ── Audit Logs ─────────────────────────────────────────────────────────────
  getAuditLogs(params = {}) {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );
    return apiClient.get('/admin/audit-logs', { params: cleanParams });
  },

  // ── Workouts ──────────────────────────────────────────────────────────────
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
  updateBadge: (id, d) => apiClient.put(`/admin/badges/${id}`, { id, ...d }), // <--- SHTO KËTË
  deleteBadge: (id) => apiClient.delete(`/admin/badges/${id}`),
  uploadFile: (formData) => apiClient.post('/admin/badges/upload-icon', formData),

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
  removeRoleFromUser: (userId, roleId) => apiClient.delete(`/admin/users/${userId}/roles/${roleId}`),

  // ── Roles ──────────────────────────────────────────────────────────────────
  getRoles:          () => apiClient.get('/admin/roles'),
  getRoleDetails:    (id) => apiClient.get(`/admin/roles/${id}`),
  createRole:        (data) => apiClient.post('/admin/roles', data),
  updateRole:        (id, data) => apiClient.put(`/admin/roles/${id}`, data),
  deleteRole:        (id) => apiClient.delete(`/admin/roles/${id}`),
  assignPermission:  (roleId, permId) => apiClient.post(`/admin/roles/${roleId}/permissions/${permId}`),
  removePermission:  (roleId, permId) => apiClient.delete(`/admin/roles/${roleId}/permissions/${permId}`),
  // ── Exercise Categories ──────────────────────────────────────────────────
  getExerciseCategories:   () => apiClient.get('/ExerciseCategories'),
  getExerciseCategoryById: (id) => apiClient.get(`/ExerciseCategories/${id}`),
  createExerciseCategory: (data) => apiClient.post('/ExerciseCategories', data),
  updateExerciseCategory: (id, data) => apiClient.put(`/ExerciseCategories/${id}`, data),
  deleteExerciseCategory: (id) => apiClient.delete(`/ExerciseCategories/${id}`),
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