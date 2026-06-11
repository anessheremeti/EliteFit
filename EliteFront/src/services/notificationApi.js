const BASE = 'https://localhost:7049/api'

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

export const notificationApi = {
  getAll:       ()    => request('GET',    '/notifications'),
  getUnreadCount: ()  => request('GET',    '/notifications/unread-count'),
  markRead:     (id)  => request('PATCH',  `/notifications/${id}/read`),
  markAllRead:  ()    => request('PATCH',  '/notifications/read-all'),
  delete:       (id)  => request('DELETE', `/notifications/${id}`),
}
