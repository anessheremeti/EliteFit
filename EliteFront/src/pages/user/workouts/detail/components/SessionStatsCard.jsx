import { Flame, Clock, BarChart2, CalendarClock, Trophy } from 'lucide-react';

function formatDuration(totalSeconds) {
  if (!totalSeconds) return '—';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${totalSeconds}s`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day:   'numeric',
      year:  'numeric',
    });
  } catch (e) {
    return '—';
  }
}

const ICON_COLORS = {
  sky:    'bg-sky/10 text-sky',
  orange: 'bg-orange-100 text-orange-500',
  green:  'bg-emerald-100 text-emerald-600',
  purple: 'bg-purple-100 text-purple-600',
};

function StatItem({ icon: Icon, label, value, color = 'sky' }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${ICON_COLORS[color]}`}>
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-dark/40 font-medium uppercase tracking-wide leading-none mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-dark truncate">{value}</p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 animate-pulse space-y-4">
      <div className="h-4 w-32 bg-gray-100 rounded" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-3 items-center">
            <div className="w-9 h-9 rounded-xl bg-gray-100 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-2 w-12 bg-gray-100 rounded" />
              <div className="h-3.5 w-20 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SessionStatsCard({ stats, loading }) {
  if (loading) return <LoadingSkeleton />;

  // Përshtatja: Kontroll i sigurt nëse nuk ka statistika ose totalSessions është 0/undefined
  const totalSessions = stats?.totalSessions || 0;
  const totalCalories = stats?.totalCalories || 0;
  // Suporton si 'totalSeconds' ashtu edhe 'totalDurationSeconds' varësisht si e ka emëruar backend-i
  const totalSeconds = stats?.totalSeconds ?? stats?.totalDurationSeconds ?? 0;
  const lastCompletedAt = stats?.lastCompletedAt || null;

  const bestCalories = stats?.bestCalories || 0;
  const bestDurationSeconds = stats?.bestDurationSeconds || 0;

  if (!stats || totalSessions === 0) {
    return (
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 size={15} className="text-sky" />
          <h3 className="text-sm font-bold text-dark">Your Progress</h3>
        </div>
        <div className="text-center py-5">
          <p className="text-3xl mb-2">🏋️</p>
          <p className="text-sm font-medium text-dark/60">No sessions logged yet</p>
          <p className="text-xs text-dark/40 mt-1">Start the timer and finish a workout to track your progress!</p>
        </div>
      </div>
    );
  }

  // Kontrollon nëse përdoruesi ka arritur rekorde personale
  const hasBests = bestCalories > 0 || bestDurationSeconds > 0;

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2">
        <BarChart2 size={15} className="text-sky" />
        <h3 className="text-sm font-bold text-dark">Your Progress</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatItem icon={BarChart2}      label="Sessions"     value={totalSessions}                       color="sky"    />
        <StatItem icon={Flame}          label="Calories"     value={`${totalCalories} kcal`}            color="orange" />
        <StatItem icon={Clock}          label="Total Time"   value={formatDuration(totalSeconds)}        color="green"  />
        <StatItem icon={CalendarClock} label="Last Session" value={formatDate(lastCompletedAt)}       color="purple" />
      </div>

      {/* Seksioni i rekordeve personale */}
      {hasBests && (
        <div className="pt-3 border-t border-black/5">
          <div className="flex items-center gap-1.5 mb-2">
            <Trophy size={13} className="text-amber-500" />
            <p className="text-[11px] text-dark/40 font-medium uppercase tracking-wide">Personal Bests</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            {bestCalories > 0 && (
              <span className="text-xs text-dark/70">
                🔥 <span className="font-semibold text-dark">{bestCalories} kcal</span>
              </span>
            )}
            {bestDurationSeconds > 0 && (
              <span className="text-xs text-dark/70">
                ⏱ <span className="font-semibold text-dark">{formatDuration(bestDurationSeconds)}</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}