import { Play, Pause, RotateCcw, CheckCircle, Timer, Flame } from 'lucide-react';

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const STATUS_HINT = {
  idle:    'Play the video — timer starts automatically',
  running: 'Session in progress — keep going!',
  paused:  'Session paused — resume the video or click Finish Workout',
};

/**
 * Controlled display component. Të gjitha gjendjet e timer-it menaxhohen nga prindi.
 * Props:
 * elapsedSeconds – koha aktuale e seancës në sekonda
 * status          – 'idle' | 'running' | 'paused'
 * liveCalories    – kalorive e llogaritura live për këtë seancë
 * onStart/onPause/onResume/onFinish/onReset – funksionet callback për veprime
 * disabled        – bllokon butonat destruktivë gjatë ruajtjes në databazë
 */
export function WorkoutTimer({
  elapsedSeconds = 0,
  status         = 'idle',
  liveCalories   = 0,
  onStart,
  onPause,
  onResume,
  onFinish,
  onReset,
  disabled = false,
}) {
  // Sigurohemi që kaloritë shfaqen si numër i plotë (p.sh. 42 kcal në vend të 42.15)
  const displayCalories = Math.round(liveCalories);

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer size={15} className="text-sky" />
          <h3 className="text-sm font-bold text-dark">Current Session</h3>
        </div>

        {/* Live calorie badge — shfaqet vetëm kur nis stërvitja */}
        {status !== 'idle' && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100 border-solid animate-pulse">
            <Flame size={12} className="text-orange-500 fill-orange-500" />
            <span className="text-xs font-semibold text-orange-600 tabular-nums">
              {displayCalories} kcal
            </span>
          </div>
        )}
      </div>

      {/* Elapsed time display */}
      <div className="text-center mb-5">
        <span className="font-mono text-5xl font-bold text-dark tabular-nums tracking-tight">
          {formatTime(elapsedSeconds)}
        </span>
        <p className="text-xs text-dark/40 mt-2 font-medium">
          {STATUS_HINT[status]}
        </p>
      </div>

      {/* Action buttons bllok sipas gjendjes së stërvitjes */}
      <div className="flex items-center justify-center gap-2">

        {status === 'idle' && (
          <button
            onClick={onStart}
            disabled={disabled}
            className="flex items-center gap-2 px-6 py-2.5 bg-sky text-white rounded-xl font-semibold text-sm
                       hover:bg-sky/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play size={15} fill="currentColor" />
            Start Workout
          </button>
        )}

        {status === 'running' && (
          <>
            <button
              onClick={onPause}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-100 text-amber-700 rounded-xl font-semibold text-sm
                         hover:bg-amber-200 active:scale-95 transition-all"
            >
              <Pause size={15} />
              Pause
            </button>
            <button
              onClick={onFinish}
              disabled={disabled}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold text-sm
                         hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={15} />
              Finish Workout
            </button>
          </>
        )}

        {status === 'paused' && (
          <>
            <button
              onClick={onResume}
              className="flex items-center gap-2 px-4 py-2.5 bg-sky text-white rounded-xl font-semibold text-sm
                         hover:bg-sky/90 active:scale-95 transition-all"
            >
              <Play size={15} fill="currentColor" />
              Resume
            </button>
            <button
              onClick={onFinish}
              disabled={disabled}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold text-sm
                         hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={15} />
              Finish Workout
            </button>
            <button
              onClick={onReset}
              className="p-2.5 rounded-xl text-dark/40 hover:text-dark hover:bg-gray-100 active:scale-95 transition-all"
              aria-label="Reset timer"
            >
              <RotateCcw size={15} />
            </button>
          </>
        )}

      </div>
    </div>
  );
}