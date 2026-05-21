const API = 'http://localhost:5193/api';

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function get(path) {
  const res = await fetch(`${API}${path}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const exerciseLogService = {
  getSessionStats : (exerciseId) => get(`/exercise-logs/session-stats?exerciseId=${exerciseId}`),
  getHistory      : (page = 1, pageSize = 20) => get(`/exercise-logs?page=${page}&pageSize=${pageSize}`),
  getSummary      : () => get('/exercise-logs/summary'),
  logExercise     : (data) => post('/exercise-logs', data),
};
