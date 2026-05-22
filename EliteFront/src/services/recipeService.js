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

export const recipeService = {
  getFeed: ({ category, dietType, search, page = 1, pageSize = 12 } = {}) => {
    const p = new URLSearchParams();
    if (category && category !== 'All') p.set('category', category);
    if (dietType  && dietType  !== 'All') p.set('dietType', dietType);
    if (search    && search.trim())       p.set('search',   search.trim());
    p.set('page',     String(page));
    p.set('pageSize', String(pageSize));
    return request(`/recipes?${p}`);
  },

  getById:      (id)  => request(`/recipes/${id}`),
  getCategories: ()   => request('/recipes/categories'),
};
