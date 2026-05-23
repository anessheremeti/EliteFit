import { motion } from 'framer-motion';
import { CheckCircle2, Lock } from 'lucide-react';

// ── Visual config ─────────────────────────────────────────────────────────────

export const TIER_CONFIG = {
  Bronze:   { pill: 'bg-amber-100 text-amber-700 border border-amber-200',  glow: 'shadow-amber-200/70',  ring: 'ring-amber-300/50'   },
  Silver:   { pill: 'bg-slate-100 text-slate-600 border border-slate-200',  glow: 'shadow-slate-200/70',  ring: 'ring-slate-300/50'   },
  Gold:     { pill: 'bg-yellow-100 text-yellow-700 border border-yellow-200', glow: 'shadow-yellow-300/70', ring: 'ring-yellow-300/50' },
  Platinum: { pill: 'bg-sky-100 text-sky-700 border border-sky-200',        glow: 'shadow-sky-300/70',    ring: 'ring-sky-300/50'     },
  Legend:   { pill: 'bg-purple-100 text-purple-700 border border-purple-200', glow: 'shadow-purple-400/70', ring: 'ring-purple-400/50' },
};

const TIER_DOTS = {
  Bronze: 1, Silver: 2, Gold: 3, Platinum: 4, Legend: 5,
};

// ── Sub-components ────────────────────────────────────────────────────────────

function TierPill({ tier }) {
  const cfg = TIER_CONFIG[tier] ?? TIER_CONFIG.Bronze;
  const dots = TIER_DOTS[tier] ?? 1;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.pill}`}>
      <span className="flex gap-0.5">
        {Array.from({ length: dots }).map((_, i) => (
          <span key={i} className="w-1 h-1 rounded-full bg-current opacity-80" />
        ))}
      </span>
      {tier}
    </span>
  );
}

function ProgressBar({ pct, color }) {
  return (
    <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
        className="h-full rounded-full"
        style={{ backgroundColor: color ?? '#6B7280' }}
      />
    </div>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────

export function BadgeCard({ badge, onClick }) {
  const tier   = TIER_CONFIG[badge.tier] ?? TIER_CONFIG.Bronze;
  const earned = badge.status === 'earned';
  const inProg = badge.status === 'in_progress';
  const locked = badge.status === 'locked';

  const cardBase = `relative flex flex-col items-center text-center gap-2 p-4 rounded-2xl
                    border cursor-pointer select-none transition-all duration-200 group`;

  const cardState = earned
    ? `bg-white border-black/8 shadow-md ${tier.glow} hover:shadow-lg hover:-translate-y-0.5`
    : inProg
      ? 'bg-white border-black/8 shadow-sm hover:shadow-md hover:-translate-y-0.5'
      : 'bg-gray-50 border-black/5 hover:bg-white hover:shadow-sm';

  return (
    <motion.div
      onClick={() => onClick(badge)}
      className={`${cardBase} ${cardState}`}
      whileHover={{ scale: earned ? 1.02 : 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Colored top accent bar */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl"
        style={{ backgroundColor: earned ? (badge.color ?? '#6B7280') : 'transparent' }}
      />

      {/* Earned checkmark */}
      {earned && (
        <div className="absolute top-2.5 right-2.5">
          <CheckCircle2 size={14} className="text-emerald-500" />
        </div>
      )}

      {/* Secret lock overlay */}
      {locked && badge.isSecret && (
        <div className="absolute top-2.5 right-2.5">
          <Lock size={12} className="text-gray-300" />
        </div>
      )}

      {/* Emoji */}
      <div
        className={`text-4xl leading-none mt-1 transition-all duration-200
                    ${locked ? 'grayscale opacity-30' : ''}
                    ${earned ? 'drop-shadow-sm' : ''}`}
      >
        {badge.iconEmoji ?? '🏅'}
      </div>

      {/* Tier + Name */}
      <div className="space-y-1 w-full">
        <TierPill tier={badge.tier} />
        <p className={`text-xs font-bold leading-tight
                       ${earned ? 'text-dark' : inProg ? 'text-dark/70' : 'text-dark/35'}`}>
          {badge.name}
        </p>
      </div>

      {/* Status line */}
      {earned ? (
        <p className="text-[10px] text-emerald-600 font-semibold">
          {badge.earnedAt
            ? `Earned ${new Date(badge.earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            : 'Earned'}
        </p>
      ) : inProg ? (
        <div className="w-full space-y-1">
          <ProgressBar pct={badge.progressPct} color={badge.color} />
          <p className="text-[10px] text-dark/40 font-medium">
            {badge.progressCount.toLocaleString()} / {badge.triggerThreshold.toLocaleString()}
          </p>
        </div>
      ) : (
        <p className="text-[10px] text-dark/30 font-medium">
          {badge.isSecret ? '???' : `${badge.triggerThreshold.toLocaleString()} needed`}
        </p>
      )}

      {/* Points chip */}
      {badge.points > 0 && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                          ${earned ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
          +{badge.points} XP
        </span>
      )}
    </motion.div>
  );
}
