import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

export function NotificationsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">

      {/* Animated bell icon */}
      <div className="relative mb-6">
        <motion.span
          animate={{ scale: [1, 1.6], opacity: [0.18, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full bg-sky/20"
        />
        <motion.span
          animate={{ scale: [1, 1.35], opacity: [0.22, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
          className="absolute inset-0 rounded-full bg-sky/20"
        />
        <motion.div
          animate={{ rotate: [0, -8, 8, -5, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
          className="relative w-20 h-20 rounded-3xl bg-sky/10 flex items-center justify-center"
        >
          <Bell size={36} className="text-sky" strokeWidth={1.5} />
        </motion.div>
      </div>

      <h2 className="text-xl font-heading font-bold text-dark mb-2">
        No Notifications Available
      </h2>
      <p className="text-sm text-dark/45 max-w-xs leading-relaxed">
        You're all caught up. Activity updates, workout reminders, and achievements
        will appear here once they're available.
      </p>
    </div>
  );
}
