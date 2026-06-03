const BASE = 'http://localhost:5193/api'

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Request failed (${res.status})`)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export const adminApi = {
  // ── Audit Logs ─────────────────────────────────────────────────────────────
  getAuditLogs(params = {}) {
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    )
    const qs = new URLSearchParams(clean).toString()
    return request('GET', `/admin/audit-logs${qs ? `?${qs}` : ''}`)
  },

  // ── Recipes ────────────────────────────────────────────────────────────────
  getRecipes:   ()       => request('GET',    '/admin/recipes'),
  createRecipe: (data)   => request('POST',   '/admin/recipes', data),
  updateRecipe: (id, d)  => request('PUT',    `/admin/recipes/${id}`, { id, ...d }),
  deleteRecipe: (id)     => request('DELETE', `/admin/recipes/${id}`),

  // ── Badges ─────────────────────────────────────────────────────────────────
  getBadges:   ()       => request('GET',    '/admin/badges'),
  createBadge: (data)   => request('POST',   '/admin/badges', data),
  deleteBadge: (id)     => request('DELETE', `/admin/badges/${id}`),

  // ── QuickFix Tips ──────────────────────────────────────────────────────────
  getTips:    ()        => request('GET',    '/admin/quickfix-tips'),
  createTip:  (data)    => request('POST',   '/admin/quickfix-tips', data),
  updateTip:  (id, d)   => request('PUT',    `/admin/quickfix-tips/${id}`, { id, ...d }),
  deleteTip:  (id)      => request('DELETE', `/admin/quickfix-tips/${id}`),

  // ── Users ──────────────────────────────────────────────────────────────────
  getUsers:         ()           => request('GET',    '/admin/users'),
  activateUser:     (id)         => request('PATCH',  `/admin/users/${id}/activate`),
  deactivateUser:   (id)         => request('PATCH',  `/admin/users/${id}/deactivate`),
  assignRoleToUser: (userId, roleId) => request('POST',   `/admin/users/${userId}/roles/${roleId}`),
  removeRoleFromUser: (userId, roleId) => request('DELETE', `/admin/users/${userId}/roles/${roleId}`),

  // ── Roles ──────────────────────────────────────────────────────────────────
  getRoles:          ()           => request('GET',    '/admin/roles'),
  getRoleDetails:    (id)         => request('GET',    `/admin/roles/${id}`),
  createRole:        (data)       => request('POST',   '/admin/roles', data),
  updateRole:        (id, data)   => request('PUT',    `/admin/roles/${id}`, data),
  deleteRole:        (id)         => request('DELETE', `/admin/roles/${id}`),
  assignPermission:  (roleId, permId) => request('POST',   `/admin/roles/${roleId}/permissions/${permId}`),
  removePermission:  (roleId, permId) => request('DELETE', `/admin/roles/${roleId}/permissions/${permId}`),

  // ── Permissions ────────────────────────────────────────────────────────────
  getPermissions: () => request('GET', '/admin/permissions'),
}
