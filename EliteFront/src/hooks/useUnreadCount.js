import { useState, useEffect, useCallback } from 'react'
import { notificationApi } from '../services/notificationApi'

const POLL_MS = 30_000

export function useUnreadCount() {
  const [count, setCount] = useState(0)

  const refresh = useCallback(async () => {
    try {
      const result = await notificationApi.getUnreadCount()
      setCount(typeof result === 'number' ? result : 0)
    } catch {
      // silently ignore — badge just stays at last known value
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    refresh()
    const id = setInterval(refresh, POLL_MS)
    return () => clearInterval(id)
  }, [refresh])

  return count
}
