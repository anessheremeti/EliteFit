const API = 'http://localhost:5193/api';

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(path) {
  const res = await fetch(`${API}${path}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

export const workoutService = {
  getAll: (category, difficulty, muscleGroup) => {
    const p = new URLSearchParams();
    if (category    && category    !== 'All') p.set('category',    category);
    if (difficulty  && difficulty  !== 'All') p.set('difficulty',  difficulty);
    if (muscleGroup && muscleGroup !== 'All') p.set('muscleGroup', muscleGroup);
    const qs = p.toString() ? `?${p}` : '';
    return request(`/workouts${qs}`);
  },

  getFeatured:        (count = 3) => request(`/workouts/featured?count=${count}`),
  getWorkoutById:     (id)        => request(`/workouts/${id}`),
  getById:            (id)        => request(`/workouts/${id}`),
  getCategories:      ()          => request('/workouts/categories'),
  getContinueWatching:()          => request('/workouts/continue-watching'),

  getRelatedWorkouts: (id, category) => {
    const qs = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    return request(`/workouts/${id}/related${qs}`);
  },

  getVideos: (category) => {
    const qs = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    return request(`/workout-videos${qs}`);
  },

  getVideoById: (id) => request(`/workout-videos/${id}`),
};
