import { motion } from 'framer-motion';
import { Dumbbell, Trophy, Flame, Apple, Clock, Info } from 'lucide-react';

// ── Type → icon + color config ────────────────────────────────────────────────

const TYPE_CONFIG = {
  workout:     { icon: Dumbbell, bg: 'bg-sky/10',      color: 'text-sky'        },
  achievement: { icon: Trophy,   bg: 'bg-amber-50',    color: 'text-amber-500'  },
  streak:      { icon: Flame,    bg: 'bg-orange-50',   color: 'text-orange-500' },
  nutrition:   { icon: Apple,    bg: 'bg-emerald-50',  color: 'text-emerald-500'},
  reminder:    { icon: Clock,    bg: 'bg-violet-50',   color: 'text-violet-500' },
  system:      { icon: Info,     bg: 'bg-slate-100',   color: 'text-slate-400'  },
};

// ── Relative timestamp ─────────────────────────────────────────────────────────

function formatTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = 60_000, h = 3_600_000, d = 86_400_000;
  if (diff < m)       return 'Just now';
  if (diff < h)       return `${Math.floor(diff / m)}m ago`;
  if (diff < d)       return `${Math.floor(diff / h)}h ago`;
  if (diff < 2 * d)   return 'Yesterday';
  if (diff < 7 * d)   return `${Math.floor(diff / d)}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Component ─────────────────────────────────────────────────────────────────

export function NotificationItem({ notification, onRead }) {
  const { id, type, title, message, timestamp, read } = notification;
  const cfg  = TYPE_CONFIG[type] ?? TYPE_CONFIG.system;
  const Icon = cfg.icon;

  return (
    <motion.button
      type="button"
      onClick={() => !read && onRead(id)}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.99 }}
      aria-label={read ? title : `${title} — unread`}
      className={[
        'w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-150',
        read
          ? 'bg-surface/60 border-black/[0.04] hover:bg-white hover:border-black/8 cursor-default'
          : 'bg-white border-black/8 shadow-sm hover:shadow-md border-l-[3px] border-l-sky cursor-pointer',
      ].join(' ')}
    >
      {/* Type icon */}
      <div
        className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${cfg.bg}`}
        aria-hidden="true"
      >
        <Icon size={16} className={cfg.color} />
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-snug ${read ? 'font-medium text-dark/55' : 'font-bold text-dark'}`}>
            {title}
          </p>
          <time
            dateTime={timestamp}
            className={`text-[11px] shrink-0 mt-0.5 tabular-nums ${read ? 'text-dark/30' : 'text-sky font-semibold'}`}
          >
            {formatTime(timestamp)}
          </time>
        </div>
        <p className={`text-xs mt-0.5 leading-relaxed line-clamp-2 ${read ? 'text-dark/35' : 'text-dark/60'}`}>
          {message}
        </p>
      </div>

      {/* Unread indicator dot */}
      {!read && (
        <span
          aria-hidden="true"
          className="w-2 h-2 rounded-full bg-sky shrink-0 mt-1.5"
        />
      )}
    </motion.button>
  );
}
