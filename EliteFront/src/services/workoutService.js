const BASE = 'http://localhost:5193/api'

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { headers: authHeaders() })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

// Map backend WorkoutVideoDto → shape the UI pages expect
function normalize(v) {
  return {
    id:              v.id,
    videoId:         v.id,
    title:           v.title          ?? '',
    description:     v.description    ?? '',
    category:        String(v.categoryId ?? ''),
    categoryId:      v.categoryId     ?? null,
    durationMin:     v.durationSeconds != null ? Math.round(v.durationSeconds / 60) : 0,
    durationSeconds: v.durationSeconds ?? 0,
    difficulty:      v.difficultyLevel ?? '',
    muscleGroup:     v.muscleGroup     ?? '',
    calories:        v.estimatedCaloriesBurned ?? 0,
    thumbnailUrl:    v.thumbnailUrl    ?? null,
    videoUrl:        v.videoUrl        ?? null,
  }
}

export const workoutService = {
  async getAll() {
    const data = await get('/workouts/videos')
    return (data ?? []).map(normalize)
  },

  async getFeatured(limit = 3) {
    const data = await get('/workouts/videos')
    return (data ?? []).slice(0, limit).map(normalize)
  },

  async getCategories() {
    const data = await get('/workouts/videos')
    return [...new Set((data ?? []).map(v => String(v.categoryId ?? '')).filter(Boolean))]
  },

  // No dedicated continue-watching endpoint yet — return empty list
  async getContinueWatching() {
    return []
  },

  async getWorkoutById(id) {
    const data = await get('/workouts/videos')
    const found = (data ?? []).find(v => String(v.id) === String(id))
    if (!found) throw new Error('Workout not found')
    return normalize(found)
  },

  async getRelatedWorkouts(currentId, category) {
    const data = await get('/workouts/videos')
    return (data ?? [])
      .filter(v => String(v.id) !== String(currentId))
      .filter(v => !category || String(v.categoryId ?? '') === category)
      .slice(0, 6)
      .map(normalize)
  },
}
