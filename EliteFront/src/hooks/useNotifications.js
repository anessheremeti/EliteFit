import { useState, useEffect, useCallback, useRef } from 'react'
import { notificationApi } from '../services/notificationApi'

const HUB_URL = 'http://localhost:5193/hubs/notifications'

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount]     = useState(0)
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const connectionRef                     = useRef(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await notificationApi.getAll()
      const list = data ?? []
      setNotifications(list)
      setUnreadCount(list.filter(n => !n.isRead).length)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const markRead = useCallback(async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
    try {
      await notificationApi.markRead(id)
    } catch {
      load()
    }
  }, [load])

  const markAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
    try {
      await notificationApi.markAllRead()
    } catch {
      load()
    }
  }, [load])

  const remove = useCallback(async (id) => {
    // Read current state snapshot before the optimistic update
    setNotifications(prev => {
      const target = prev.find(n => n.id === id)
      // Schedule the unread decrement separately to avoid calling a setter inside another setter
      if (target && !target.isRead) {
        setTimeout(() => setUnreadCount(c => Math.max(0, c - 1)), 0)
      }
      return prev.filter(n => n.id !== id)
    })
    try {
      await notificationApi.delete(id)
    } catch {
      load()
    }
  }, [load])

  // Initial data fetch
  useEffect(() => { load() }, [load])

  // SignalR real-time connection — dynamically imported so a CJS/ESM bundling
  // issue never crashes the component tree (white page).
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    let connection = null

    async function connect() {
      try {
        const signalR = await import('@microsoft/signalr')

        connection = new signalR.HubConnectionBuilder()
          .withUrl(HUB_URL, { accessTokenFactory: () => localStorage.getItem('token') })
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Warning)
          .build()

        connection.on('ReceiveNotification', (data) => {
          const notification = typeof data === 'string' ? JSON.parse(data) : data
          if (!notification?.id) return
          setNotifications(prev => [notification, ...prev])
          if (!notification.isRead) setUnreadCount(prev => prev + 1)
        })

        await connection.start()
        connectionRef.current = connection
      } catch (err) {
        console.warn('[SignalR] connection failed:', err?.message ?? err)
      }
    }

    connect()

    return () => {
      connectionRef.current?.stop()
      connectionRef.current = null
    }
  }, [])

  return { notifications, unreadCount, loading, error, markRead, markAllRead, remove, reload: load }
}
