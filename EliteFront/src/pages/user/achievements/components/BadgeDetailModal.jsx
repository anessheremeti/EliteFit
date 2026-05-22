import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Lock, Target, Zap, Calendar } from 'lucide-react';
import { TIER_CONFIG } from './BadgeCard';

// ── Helpers ───────────────────────────────────────────────────────────────────

const TRIGGER_LABELS = {
  WorkoutsCompleted: 'Workouts completed',
  CaloriesBurned:    'Calories burned',
  StreakDays:        'Day streak',
  ProfileCompleted:  'Profile setup',
  PointsEarned:      'XP earned',
  Manual:            'Special achievement',
};

function ProgressRing({ pct, color, size = 80 }) {
  const r   = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
              stroke="#F3F4F6" strokeWidth={6} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color ?? '#6B7280'} strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
    </svg>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export function BadgeDetailModal({ badge, onClose }) {
  if (!badge) return null;

  const tier   = TIER_CONFIG[badge.tier] ?? TIER_CONFIG.Bronze;
  const earned = badge.status === 'earned';
  const inProg = badge.status === 'in_progress';

  return (
    <AnimatePresence>
      {badge && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:inset-0 md:flex md:items-center md:justify-center"
          >
            <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-sm
                            shadow-2xl overflow-hidden max-h-[92dvh] overflow-y-auto">

              {/* Header bar with accent color */}
              <div
                className="h-1.5 w-full"
                style={{ backgroundColor: earned ? (badge.color ?? '#6B7280') : '#E5E7EB' }}
              />

              <div className="p-6 space-y-5">
                {/* Close */}
                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-xl text-dark/30 hover:text-dark hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Visual — ring + emoji */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative flex items-center justify-center">
                    <ProgressRing
                      pct={badge.progressPct}
                      color={badge.color}
                      size={88}
                    />
                    <span
                      className={`absolute text-4xl transition-all
                                  ${!earned ? 'grayscale opacity-40' : ''}`}
                    >
                      {badge.iconEmoji ?? '🏅'}
                    </span>
                  </div>

                  {/* Tier pill */}
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tier.pill}`}>
                    {badge.tier}
                  </span>
                </div>

                {/* Name + description */}
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-bold text-dark font-heading">{badge.name}</h2>
                  <p className="text-sm text-dark/50 leading-relaxed">{badge.description}</p>
                </div>

                {/* Status banner */}
                {earned ? (
                  <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-emerald-700">Badge earned!</p>
                      {badge.earnedAt && (
                        <p className="text-xs text-emerald-600">
                          {new Date(badge.earnedAt).toLocaleDateString('en-US', {
                            weekday: 'short', year: 'numeric', month: 'long', day: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ) : badge.isSecret ? (
                  <div className="flex items-center gap-3 p-3.5 bg-gray-50 border border-gray-100 rounded-2xl">
                    <Lock size={18} className="text-gray-400 shrink-0" />
                    <p className="text-sm text-gray-500 font-medium">Keep training to unlock.</p>
                  </div>
                ) : (
                  <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <Target size={14} className="text-dark/40" />
                        <span className="text-xs text-dark/50 font-medium">
                          {TRIGGER_LABELS[badge.triggerType] ?? 'Requirement'}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-dark">
                        {badge.progressCount.toLocaleString()}
                        <span className="text-dark/30 font-medium"> / {badge.triggerThreshold.toLocaleString()}</span>
                      </span>
                    </div>
                    <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${badge.progressPct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: badge.color ?? '#6B7280' }}
                      />
                    </div>
                    <p className="text-xs text-dark/40 text-center">
                      {inProg
                        ? `${badge.progressPct}% — almost there!`
                        : `Complete ${badge.triggerThreshold.toLocaleString()} ${(TRIGGER_LABELS[badge.triggerType] ?? 'actions').toLowerCase()} to unlock`}
                    </p>
                  </div>
                )}

                {/* Points reward */}
                {badge.points > 0 && (
                  <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl">
                    <Zap size={14} className="text-yellow-500" />
                    <span className="text-sm font-bold text-dark">
                      {earned ? '+' : ''}{badge.points} XP
                    </span>
                    {!earned && (
                      <span className="text-xs text-dark/40">upon completion</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
