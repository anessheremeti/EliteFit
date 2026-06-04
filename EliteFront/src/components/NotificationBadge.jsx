import { useState, useEffect } from 'react'

const API = 'http://localhost:5193/api/notifications/unread-count'

export default function NotificationBadge() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let alive = true

    async function poll() {
      try {
        const token = localStorage.getItem('token')
        if (!token) return
        const res = await fetch(API, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok && alive) {
          const n = await res.json()
          setCount(typeof n === 'number' ? n : 0)
        }
      } catch {
        // network down, token invalid — stay silent
      }
    }

    poll()
    const id = setInterval(poll, 30_000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  if (count === 0) return null

  return (
    <span
      aria-label={`${count} unread notifications`}
      className="absolute -top-1 -right-1 min-w-3.5 h-3.5 px-0.5 rounded-full bg-sky text-white text-[9px] font-bold flex items-center justify-center leading-none pointer-events-none"
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}
