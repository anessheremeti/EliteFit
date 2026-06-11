const BASE = 'https://localhost:7049/api'

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export const exerciseLogService = {
  async logExercise({ workoutId, durationSeconds, caloriesBurned }) {
    return post('/workouts/complete-video', {
      workoutVideoId: workoutId,
      durationSeconds,
      caloriesBurned,
    })
  },

  // No dedicated session-stats endpoint yet — non-fatal, returns null
  async getSessionStats(_videoId) {
    return null
  },
}
