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

export const badgeService = {
  getGallery: (category) => {
    const p = new URLSearchParams();
    if (category && category !== 'All') p.set('category', category);
    const qs = p.toString();
    return request(`/badges${qs ? `?${qs}` : ''}`);
  },
};
