import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { VideoPlayer }      from './components/VideoPlayer';
import { WorkoutStats }     from './components/WorkoutStats';
import { RelatedWorkouts }  from './components/RelatedWorkouts';
import { WorkoutTimer }     from './components/WorkoutTimer';
import { SessionStatsCard } from './components/SessionStatsCard';
import { workoutService }     from '../../../../services/workoutService';
import { exerciseLogService } from '../../../../services/exerciseLogService';

// Calories-per-minute by difficulty level
const CAL_PER_MIN = { Beginner: 5, Intermediate: 8, Advanced: 12 };
function estimateCalories(durationSeconds, difficulty) {
  const rate = CAL_PER_MIN[difficulty] ?? 7;
  return Math.max(1, Math.round((durationSeconds / 60) * rate));
}

// ─── Skeletons ────────────────────────────────────────────────────────────────
function PlayerSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="aspect-video rounded-2xl bg-gray-200" />
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 space-y-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 bg-gray-100 rounded w-1/4" />
            <div className="h-3.5 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function LoggedToast({ visible }) {
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shrink-0"
    >
      <CheckCircle size={13} />
      Session logged!
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function WorkoutDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  // Workout / related data
  const [workout,    setWorkout]    = useState(null);
  const [related,    setRelated]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [relLoading, setRelLoading] = useState(true);
  const [error,      setError]      = useState(null);

  // Session stats (historical, refreshed after each log)
  const [sessionStats,  setSessionStats]  = useState(null);
  const [statsLoading,  setStatsLoading]  = useState(false);

  // Logging state
  const [isLogging,  setIsLogging]  = useState(false);
  const [showToast,  setShowToast]  = useState(false);

  // ── Timer state (driven by video events) ──────────────────────────────────
  const [timerStatus,    setTimerStatus]    = useState('idle'); // 'idle'|'running'|'paused'
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Internal timer refs (never cause re-renders)
  const tickRef        = useRef(null);   // setInterval handle
  const runStartRef    = useRef(null);   // wall-clock when the current run began
  const accumulatedRef = useRef(0);      // seconds from prior runs (before last resume)
  const elapsedRef     = useRef(0);      // mirror of elapsedSeconds for use inside callbacks
  const isFinishingRef = useRef(false);  // suppresses handleVideoPause during finish/reset
  const isLoggingRef   = useRef(false);  // mirror of isLogging for use inside callbacks

  // Imperative handle to play/pause the VideoPlayer from outside
  const playerRef = useRef(null);

  // Keep mirrors in sync
  useEffect(() => { elapsedRef.current  = elapsedSeconds; }, [elapsedSeconds]);
  useEffect(() => { isLoggingRef.current = isLogging;     }, [isLogging]);

  // Live calorie estimate — updates every tick as the timer runs
  const liveCalories = useMemo(() => {
    if (!workout || elapsedSeconds < 1) return 0;
    return estimateCalories(elapsedSeconds, workout.difficulty);
  }, [elapsedSeconds, workout]);

  // ── Timer primitives ───────────────────────────────────────────────────────

  const startTick = useCallback(() => {
    runStartRef.current = Date.now();
    tickRef.current = setInterval(() => {
      const since = Math.floor((Date.now() - runStartRef.current) / 1000);
      setElapsedSeconds(accumulatedRef.current + since);
    }, 500);
  }, []);

  const stopTick = useCallback(() => clearInterval(tickRef.current), []);

  // Reset timer when navigating to a different workout (id changes)
  useEffect(() => {
    isFinishingRef.current = true;
    clearInterval(tickRef.current);
    accumulatedRef.current = 0;
    setElapsedSeconds(0);
    setTimerStatus('idle');
    setSessionStats(null);
    setShowToast(false);
    setTimeout(() => { isFinishingRef.current = false; }, 150);
  }, [id]);

  // Cleanup interval on unmount
  useEffect(() => () => clearInterval(tickRef.current), []);

  // ── Session logging ────────────────────────────────────────────────────────

  const autoLogSession = useCallback(async (durationSeconds) => {
    if (!workout || isLoggingRef.current || durationSeconds < 5) return;

    setIsLogging(true);
    try {
      await exerciseLogService.logExercise({
        exerciseId      : workout.videoId ?? null,
        workoutId       : parseInt(id, 10),
        durationSeconds,
        caloriesBurned  : estimateCalories(durationSeconds, workout.difficulty),
        completedAt     : new Date().toISOString(),
      });

      if (workout.videoId) {
        const updated = await exerciseLogService.getSessionStats(workout.videoId);
        setSessionStats(updated);
      }

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch { /* non-fatal */ } finally {
      setIsLogging(false);
    }
  }, [workout, id]); // isLogging accessed via ref — not in deps

  // ── Video event handlers ───────────────────────────────────────────────────

  const handleVideoPlay = useCallback(() => {
    startTick();
    setTimerStatus('running');
  }, [startTick]);

  const handleVideoPause = useCallback(() => {
    if (isFinishingRef.current) return; // finish/reset is already handling state
    stopTick();
    accumulatedRef.current = elapsedRef.current;
    setTimerStatus('paused');
  }, [stopTick]);

  const handleVideoEnded = useCallback(() => {
    if (isFinishingRef.current) return;
    stopTick();
    accumulatedRef.current = elapsedRef.current;
    setTimerStatus('paused'); // session stays active — only Finish Workout ends it
  }, [stopTick]);

  // ── Timer button handlers (mirror video commands) ──────────────────────────

  const handleTimerStart = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.play(); // video fires play → handleVideoPlay → startTick
    } else {
      // No video mounted — run timer standalone
      startTick();
      setTimerStatus('running');
    }
  }, [startTick]);

  const handleTimerPause = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.pause(); // video fires pause → handleVideoPause → stopTick
    } else {
      stopTick();
      accumulatedRef.current = elapsedRef.current;
      setTimerStatus('paused');
    }
  }, [stopTick]);

  const handleTimerResume = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.play();
    } else {
      startTick();
      setTimerStatus('running');
    }
  }, [startTick]);

  const handleTimerFinish = useCallback(() => {
    // Flag suppresses handleVideoPause from overwriting state
    isFinishingRef.current = true;
    if (playerRef.current) playerRef.current.pause();
    stopTick();
    const finalSeconds = elapsedRef.current;
    accumulatedRef.current = 0;
    setElapsedSeconds(0);
    setTimerStatus('idle');
    setTimeout(() => { isFinishingRef.current = false; }, 150);
    autoLogSession(finalSeconds);
  }, [stopTick, autoLogSession]);

  const handleTimerReset = useCallback(() => {
    isFinishingRef.current = true;
    if (playerRef.current) playerRef.current.pause();
    stopTick();
    accumulatedRef.current = 0;
    setElapsedSeconds(0);
    setTimerStatus('idle');
    setTimeout(() => { isFinishingRef.current = false; }, 150);
  }, [stopTick]);

  // ── Data fetching ──────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await workoutService.getWorkoutById(id);
        if (!cancelled) setWorkout(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load workout.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  // Load historical session stats once we know the exercise (video) id
  useEffect(() => {
    if (!workout?.videoId) return;
    let cancelled = false;
    async function loadStats() {
      setStatsLoading(true);
      try {
        const data = await exerciseLogService.getSessionStats(workout.videoId);
        if (!cancelled) setSessionStats(data);
      } catch { /* non-fatal */ } finally {
        if (!cancelled) setStatsLoading(false);
      }
    }
    loadStats();
    return () => { cancelled = true; };
  }, [workout?.videoId]);

  // Load related workouts once category is known
  useEffect(() => {
    if (!workout) return;
    let cancelled = false;
    async function loadRelated() {
      setRelLoading(true);
      try {
        const data = await workoutService.getRelatedWorkouts(id, workout.category);
        if (!cancelled) setRelated(data);
      } catch { /* silent */ } finally {
        if (!cancelled) setRelLoading(false);
      }
    }
    loadRelated();
    return () => { cancelled = true; };
  }, [id, workout]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-surface">

      {/* Sticky header */}
      <div className="sticky top-0 md:top-auto z-20 bg-surface/95 backdrop-blur-sm border-b border-black/5 px-4 md:px-6 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-1 rounded-xl text-dark/60 hover:text-dark hover:bg-white transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        {workout && (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <h1 className="text-base font-bold text-dark truncate">{workout.title}</h1>
            {workout.category && (
              <span className="shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky/10 text-sky">
                {workout.category}
              </span>
            )}
          </div>
        )}
        {loading && <div className="h-4 w-40 bg-gray-200 rounded animate-pulse flex-1" />}

        <LoggedToast visible={showToast} />
      </div>

      {/* Main content */}
      <div className="px-4 md:px-6 py-5 max-w-7xl mx-auto">

        {error && (
          <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {!error && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-5"
          >
            {/* ── Left column ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Video player */}
              {loading ? (
                <PlayerSkeleton />
              ) : workout?.videoUrl ? (
                <VideoPlayer
                  ref={playerRef}
                  src={workout.videoUrl}
                  poster={workout.thumbnailUrl ?? undefined}
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                  onEnded={handleVideoEnded}
                />
              ) : (
                <div className="aspect-video rounded-2xl bg-gray-900 flex items-center justify-center">
                  <div className="text-center text-white/40 space-y-2">
                    <p className="text-3xl">🎬</p>
                    <p className="text-sm font-medium">Video coming soon</p>
                  </div>
                </div>
              )}

              {/* Session timer — synced to video */}
              {!loading && workout && (
                <WorkoutTimer
                  elapsedSeconds={elapsedSeconds}
                  status={timerStatus}
                  liveCalories={liveCalories}
                  onStart={handleTimerStart}
                  onPause={handleTimerPause}
                  onResume={handleTimerResume}
                  onFinish={handleTimerFinish}
                  onReset={handleTimerReset}
                  disabled={isLogging}
                />
              )}

              {/* Historical session stats */}
              {!loading && workout && (
                <SessionStatsCard stats={sessionStats} loading={statsLoading} />
              )}

              {/* Mobile: workout details */}
              <div className="lg:hidden">
                {loading ? <StatsSkeleton /> : workout && <WorkoutStats workout={workout} />}
              </div>

              {/* Mobile: related workouts */}
              <div className="lg:hidden">
                <RelatedWorkouts items={related} loading={relLoading} />
              </div>
            </div>

            {/* ── Right column (desktop) ── */}
            <div className="hidden lg:flex flex-col gap-5">
              {loading ? <StatsSkeleton /> : workout && <WorkoutStats workout={workout} />}
              <RelatedWorkouts items={related} loading={relLoading} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
