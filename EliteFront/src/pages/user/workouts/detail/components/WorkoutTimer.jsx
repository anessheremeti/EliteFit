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
 * Controlled display component. All timer state lives in the parent.
 * Props:
 *   elapsedSeconds  – current session time in seconds
 *   status          – 'idle' | 'running' | 'paused'
 *   liveCalories    – estimated kcal for the current session
 *   onStart/onPause/onResume/onFinish/onReset – action callbacks
 *   disabled        – disables destructive actions while logging
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
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer size={15} className="text-sky" />
          <h3 className="text-sm font-bold text-dark">Current Session</h3>
        </div>

        {/* Live calorie badge — only visible once session starts */}
        {status !== 'idle' && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100">
            <Flame size={12} className="text-orange-500" />
            <span className="text-xs font-semibold text-orange-600 tabular-nums">
              {liveCalories} kcal
            </span>
          </div>
        )}
      </div>

      {/* Elapsed time */}
      <div className="text-center mb-5">
        <span className="font-mono text-5xl font-bold text-dark tabular-nums tracking-tight">
          {formatTime(elapsedSeconds)}
        </span>
        <p className="text-xs text-dark/40 mt-2 font-medium">
          {STATUS_HINT[status]}
        </p>
      </div>

      {/* Action buttons */}
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
