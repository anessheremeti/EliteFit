import { Bell, ArrowLeft, CheckCheck, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NotificationsEmptyState } from './components/NotificationsEmptyState'
import { NotificationItem } from './components/NotificationItem'
import { NotificationGroup } from './components/NotificationGroup'
import { useNotifications } from '../../../hooks/useNotifications'

// ── Time grouping ─────────────────────────────────────────────────────────────

function groupByTime(notifications) {
  const now = Date.now()
  const DAY = 86_400_000
  const today = [], week = [], older = []
  for (const n of notifications) {
    const age = now - new Date(n.createdAt ?? 0).getTime()
    if (age < DAY)       today.push(n)
    else if (age < 7 * DAY) week.push(n)
    else                 older.push(n)
  }
  return { today, week, older }
}

// ── Skeleton loader ───────────────────────────────────────────────────────────

function SkeletonList() {
  return (
    <div className="flex flex-col gap-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-18 rounded-2xl bg-black/4 animate-pulse" />
      ))}
    </div>
  )
}

// ── Page ────────────────======================================================

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, error, markRead, markAllRead, remove, reload } =
    useNotifications()

  const { today, week, older } = groupByTime(notifications)
  const hasAny = notifications.length > 0

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-5 mt-12 md:mt-0">

        {/* Header */}
        <div className="mb-6 space-y-4">
          {/* I përshtatur që të kthehet te rruga e saktë e panelit tënd pa nxjerrë gabim rrugësh */}
          <Link
            to="/users"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-dark/40 hover:text-sky transition-colors group"
          >
            <ArrowLeft size={13} className="transition-transform duration-150 group-hover:-translate-x-0.5" aria-hidden="true" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky/10 flex items-center justify-center shrink-0">
                <Bell size={20} className="text-sky" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-dark leading-tight">
                  Notifications
                </h1>
                <p className="text-xs text-dark/40">
                  {loading ? 'Loading…' : unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                </p>
              </div>
            </div>

            {!loading && unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-xs font-semibold text-sky hover:text-sky/70 transition-colors"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && <SkeletonList />}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-sm text-red-500 font-medium">{error}</p>
            <button
              onClick={reload}
              className="flex items-center gap-1.5 text-xs font-semibold text-sky hover:text-sky/70 transition-colors"
            >
              <RefreshCw size={13} />
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && !hasAny && <NotificationsEmptyState />}

        {/* List */}
        {!loading && !error && hasAny && (
          <div className="flex flex-col gap-5">
            {today.length > 0 && (
              <NotificationGroup label="Today">
                {today.map(n => (
                  <NotificationItem
                    key={n.id}
                    notification={{ ...n, timestamp: n.createdAt, read: n.isRead }}
                    onRead={markRead}
                    onDelete={remove}
                  />
                ))}
              </NotificationGroup>
            )}

            {week.length > 0 && (
              <NotificationGroup label="This Week">
                {week.map(n => (
                  <NotificationItem
                    key={n.id}
                    notification={{ ...n, timestamp: n.createdAt, read: n.isRead }}
                    onRead={markRead}
                    onDelete={remove}
                  />
                ))}
              </NotificationGroup>
            )}

            {older.length > 0 && (
              <NotificationGroup label="Older">
                {older.map(n => (
                  <NotificationItem
                    key={n.id}
                    notification={{ ...n, timestamp: n.createdAt, read: n.isRead }}
                    onRead={markRead}
                    onDelete={remove}
                  />
                ))}
              </NotificationGroup>
            )}
          </div>
        )}

        <div className="h-10" />
      </div>
    </div>
  )
}