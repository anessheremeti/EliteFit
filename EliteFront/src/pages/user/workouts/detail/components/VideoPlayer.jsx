import { forwardRef, useRef, useState, useEffect, useCallback, useImperativeHandle } from 'react';
import { Play, Pause, Volume2, VolumeX, Volume1, Maximize2, Minimize2, Loader2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function fmt(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Use stable refs for callbacks so the event-listener effect never needs to
// re-run when the parent passes new function references.
function useCallbackRef(fn) {
  const ref = useRef(fn);
  useEffect(() => { ref.current = fn; }, [fn]);
  return ref;
}

export const VideoPlayer = forwardRef(function VideoPlayer(
  { src, poster, onPlay, onPause, onEnded },
  ref,
) {
  const videoRef   = useRef(null);
  const wrapRef    = useRef(null);
  const hideTimer  = useRef(null);
  const clickTimer = useRef(null);

  const [playing,  setPlaying]  = useState(false);
  const [ended,    setEnded]    = useState(false);
  const [current,  setCurrent]  = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume,   setVolume]   = useState(1);
  const [muted,    setMuted]    = useState(false);
  const [fs,       setFs]       = useState(false);
  const [controls, setControls] = useState(true);
  const [loading,  setLoading]  = useState(true);
  const [showVol,  setShowVol]  = useState(false);

  // Stable callback refs — event listeners only register once per src change
  const onPlayRef   = useCallbackRef(onPlay);
  const onPauseRef  = useCallbackRef(onPause);
  const onEndedRef  = useCallbackRef(onEnded);

  // Expose play() / pause() to parent via ref
  useImperativeHandle(ref, () => ({
    play:  () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
  }), []);

  // Auto-hide controls
  const resetHide = useCallback(() => {
    setControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setControls(false);
    }, 3000);
  }, []);

  useEffect(() => {
    if (!playing) { clearTimeout(hideTimer.current); setControls(true); }
    else resetHide();
  }, [playing, resetHide]);

  // Video event listeners
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTime  = () => {
      setCurrent(v.currentTime);
      if (v.buffered.length > 0)
        setBuffered(v.buffered.end(v.buffered.length - 1));
    };
    const onMeta  = () => { setDuration(v.duration); setLoading(false); };
    const onPlayE = () => { setPlaying(true);  setEnded(false); onPlayRef.current?.(); };
    const onPauseE= () => { setPlaying(false); onPauseRef.current?.(); };
    const onEndE  = () => { setPlaying(false); setEnded(true);  onEndedRef.current?.(); };
    const onWait  = () => setLoading(true);
    const onCan   = () => setLoading(false);

    v.addEventListener('timeupdate',     onTime);
    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('play',           onPlayE);
    v.addEventListener('pause',          onPauseE);
    v.addEventListener('ended',          onEndE);
    v.addEventListener('waiting',        onWait);
    v.addEventListener('canplay',        onCan);

    return () => {
      v.removeEventListener('timeupdate',     onTime);
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('play',           onPlayE);
      v.removeEventListener('pause',          onPauseE);
      v.removeEventListener('ended',          onEndE);
      v.removeEventListener('waiting',        onWait);
      v.removeEventListener('canplay',        onCan);
    };
  }, [src]); // only re-register when src changes

  // Fullscreen
  useEffect(() => {
    const onFsChange = () => setFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      const v = videoRef.current;
      if (!v) return;
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          v.paused ? v.play() : v.pause();
          break;
        case 'f':
          e.preventDefault();
          handleToggleFs();
          break;
        case 'm':
          e.preventDefault();
          handleToggleMute();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          v.currentTime = Math.max(0, v.currentTime - 5);
          resetHide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          v.currentTime = Math.min(v.duration || 0, v.currentTime + 5);
          resetHide();
          break;
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [resetHide]);

  const handleVideoClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      handleToggleFs();
    } else {
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null;
        handleTogglePlay();
      }, 220);
    }
  };

  const handleTogglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (ended) { v.currentTime = 0; setEnded(false); }
    v.paused ? v.play() : v.pause();
  };

  const handleToggleFs = async () => {
    try {
      if (!document.fullscreenElement) await wrapRef.current?.requestFullscreen();
      else await document.exitFullscreen();
    } catch { /* browser may block */ }
  };

  const handleToggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const val = parseFloat(e.target.value);
    v.currentTime = val;
    setCurrent(val);
    resetHide();
  };

  const handleVolume = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const val = parseFloat(e.target.value);
    v.volume = val;
    setVolume(val);
    if (val === 0) { v.muted = true; setMuted(true); }
    else if (muted) { v.muted = false; setMuted(false); }
  };

  const progress   = duration > 0 ? (current / duration) * 100 : 0;
  const buffPct    = duration > 0 ? (buffered / duration) * 100 : 0;
  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      ref={wrapRef}
      className={`relative bg-black overflow-hidden select-none outline-none ${fs ? '' : 'rounded-2xl'}`}
      style={{ aspectRatio: '16/9' }}
      onMouseMove={resetHide}
      onMouseLeave={() => playing && setControls(false)}
      tabIndex={-1}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onClick={handleVideoClick}
        playsInline
        preload="metadata"
      />

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Loader2 className="w-12 h-12 text-white/60 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!playing && !loading && (
          <motion.button
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 flex items-center justify-center"
            onClick={handleTogglePlay}
          >
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors active:scale-95">
              {ended
                ? <RotateCcw size={32} className="text-white" />
                : <Play size={36} className="text-white ml-1" fill="white" />}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {controls && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/50 to-transparent pt-12 pb-4 px-4"
          >
            {/* Progress bar */}
            <div className="group/seek relative h-5 flex items-center mb-3 cursor-pointer">
              <div className="w-full h-1 rounded-full bg-white/25 relative">
                <div className="absolute top-0 left-0 h-full rounded-full bg-white/30" style={{ width: `${buffPct}%` }} />
                <div className="absolute top-0 left-0 h-full rounded-full bg-sky transition-none"  style={{ width: `${progress}%` }} />
                <div
                  className="absolute top-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover/seek:opacity-100 transition-opacity pointer-events-none"
                  style={{ left: `${progress}%` }}
                />
              </div>
              <input
                type="range"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                min={0} max={duration || 1} step={0.25}
                value={current}
                onChange={handleSeek}
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePlay}
                className="text-white hover:text-sky transition-colors p-1 rounded"
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing
                  ? <Pause size={20} fill="currentColor" />
                  : <Play  size={20} fill="currentColor" />}
              </button>

              <span className="text-white/80 text-xs font-mono tabular-nums whitespace-nowrap">
                {fmt(current)} / {fmt(duration)}
              </span>

              <div className="flex-1" />

              {/* Volume */}
              <div
                className="relative flex items-center gap-2"
                onMouseEnter={() => setShowVol(true)}
                onMouseLeave={() => setShowVol(false)}
              >
                <AnimatePresence>
                  {showVol && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 76 }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden"
                    >
                      <input
                        type="range"
                        className="w-19 cursor-pointer"
                        style={{ accentColor: '#4FC3F7' }}
                        min={0} max={1} step={0.05}
                        value={muted ? 0 : volume}
                        onChange={handleVolume}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={handleToggleMute}
                  className="text-white hover:text-sky transition-colors p-1 rounded"
                  aria-label={muted ? 'Unmute' : 'Mute'}
                >
                  <VolumeIcon size={20} />
                </button>
              </div>

              <button
                onClick={handleToggleFs}
                className="text-white hover:text-sky transition-colors p-1 rounded"
                aria-label={fs ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {fs ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
