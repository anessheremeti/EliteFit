import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Shtohet AnimatePresence për animacionet e mbylljes
import { X, CheckCircle, Clock } from 'lucide-react'; // Ikona për popup-in

// Komponentët e importuar si Named Exports
import { VideoPlayer } from './components/VideoPlayer';
import { WorkoutStats } from './components/WorkoutStats';
import { WorkoutTimer } from './components/WorkoutTimer';
import { SessionStatsCard } from './components/SessionStatsCard';
import { RelatedWorkouts } from './components/RelatedWorkouts';

// Importojmë API-n
import WorkoutApi from '../../../../api/user/workout/workouts';

export default function WorkoutDetailPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  console.log("ID-ja e kapur nga URL:", id);
  
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- SHTETET E REJA PËR TIMERIN DHE KALORITË LIVE ---
  const [status, setStatus] = useState('idle'); // 'idle' | 'running' | 'paused'
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [liveCalories, setLiveCalories] = useState(0);
  const [disabled, setDisabled] = useState(false);

  // --- SHTETI I RI PËR POPUP NOTIFICATION ---
  const [notification, setNotification] = useState(null);

  // 1. Ngarkimi i detajeve të stërvitjes nga API
  useEffect(() => {
    let cancelled = false;

    async function fetchWorkoutDetail() {
      try {
        setLoading(true);
        setError(null);

        const response = await WorkoutApi.getVideoById(id);
        if (cancelled) return;
        
        let finalWorkout = null;
        if (!response) {
          finalWorkout = null;
        } else if (response.data) {
          finalWorkout = response.data;
        } else {
          finalWorkout = response;
        }

        if (Array.isArray(finalWorkout)) {
          finalWorkout = finalWorkout[0];
        }

        if (finalWorkout && (finalWorkout.id || finalWorkout.title)) {
          setWorkout(finalWorkout);
        } else {
          setError('Kjo stërvitje nuk ekziston në databazë.');
        }

      } catch (err) {
        console.error('Gabim gjatë ngarkimit të detajeve të stërvitjes:', err);
        setError('Ndodhi një gabim gjatë ngarkimit të stërvitjes.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) {
      fetchWorkoutDetail();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  // 2. MOTORRI I TIMERT
  useEffect(() => {
    let interval = null;

    if (status === 'running') {
      const totalSec = workout?.durationSeconds || 1800; 
      const totalCal = workout?.estimatedCaloriesBurned || 300; 
      const caloriesPerSecond = totalCal / totalSec;

      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          const nextSeconds = prev + 1;
          setLiveCalories(nextSeconds * caloriesPerSecond);

          if (nextSeconds >= totalSec) {
            clearInterval(interval);
            setStatus('paused');       
            handleFinishWorkout();     
          }

          return nextSeconds;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [status, workout]);

  // 3. AUTO-CLOSE PËR POPUP-IN (Mbyll njoftimin automatikisht pas 6 sekondave)
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // 4. LIDHJA ME SIGNALR (Nëse dëshiron që popup-i të kape dhe mesazhet direkte nga konsola e SignalR)
  useEffect(() => {
    const handleSignalRNotification = (event) => {
      if (event.detail) {
        setNotification(event.detail);
      }
    };

    window.addEventListener('signalr-popup', handleSignalRNotification);
    return () => window.removeEventListener('signalr-popup', handleSignalRNotification);
  }, []);

  // 5. FUNKSIONI FINAL: Ruajtja e progresit dhe shfaqja e Popup-it në vend të alert()
  const handleFinishWorkout = async () => {
    if (disabled || elapsedSeconds === 0) return;
    setDisabled(true);
    setStatus('paused');

    const minimumSecondsRequired = 10;
    const isCompleted = elapsedSeconds >= minimumSecondsRequired;

    try {
      const command = {
        videoId: parseInt(id),          
        timeWatchedSeconds: elapsedSeconds, 
        caloriesBurned: Math.round(liveCalories), 
      };
      
      await WorkoutApi.completeVideo(command);
      
      // SHFAQJA E POPUP-IT ME STRUKTURËN E SAKTË TË KONSOLËS TËNDE
      setNotification({
        title: isCompleted ? "Workout Completed 💪" : "Progress Saved ⏱️",
        message: isCompleted 
          ? `Urime! Përfundove stërvitjen "${workout?.title || 'Stërvitje'}" dhe dogje ${Math.round(liveCalories)} kcal.`
          : "Progresi i stërvitjes u ruajt si i papërfunduar në profilin tënd.",
        createdAt: new Date().toISOString()
      });
      
      setStatus('idle');
      setElapsedSeconds(0);
      setLiveCalories(0);
    } catch (error) {
      console.error("Gabim gjatë ruajtjes së sesionit në DB:", error);
      setNotification({
        title: "Gabim ⚠️",
        message: "Ndodhi një gabim i papritur gjatë ruajtjes së sesionit të stërvitjes.",
        createdAt: new Date().toISOString()
      });
    } finally {
      setDisabled(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-dark/60">Duke ngarkuar stërvitjen...</p>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4 p-6 text-center">
        <span className="text-4xl">⚠️</span>
        <p className="text-base font-semibold text-dark/70">{error || 'Stërvitja nuk u gjet!'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-sky-500 text-white rounded-xl text-sm font-medium shadow hover:bg-sky-600 transition-all"
        >
          Kthehu prapa
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-surface p-6 relative"
    >
      
      {/* ========================================================= */}
      {/* KOMPONENTI I POPUP-IT (TOAST NOTIFICATION) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: -20, scale: 0.9, x: "-50%" }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-100 flex gap-3.5 items-start"
          >
            <div className={`p-2 rounded-xl text-white mt-0.5 shadow-sm ${notification.title.includes("Completed") ? 'bg-emerald-500' : 'bg-amber-500'}`}>
              {notification.title.includes("Completed") ? <CheckCircle size={20} /> : <Clock size={20} />}
            </div>
            
            <div className="flex-1 space-y-0.5 pr-2">
              <h4 className="text-sm font-black text-dark tracking-tight">{notification.title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">{notification.message}</p>
              <span className="text-[10px] text-dark/35 block pt-1">
                {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <button 
              onClick={() => setNotification(null)}
              className="p-1 hover:bg-gray-100 rounded-lg text-dark/30 hover:text-dark transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-dark/50 hover:text-dark mb-6 transition-colors"
      >
        ← Kthehu te Stërvitjet
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLONA E TRUPIT KRYESOR (Majtas) */}
        <div className="lg:col-span-2 space-y-6">
          
          <VideoPlayer 
            src={workout.videoUrl || workout.url} 
            poster={workout.thumbnailUrl} 
            onPlay={() => setStatus('running')}
            onPause={() => setStatus('paused')}
            onEnded={handleFinishWorkout}
          />

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-dark tracking-tight">{workout.title}</h1>
            
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1 bg-gray-100 text-xs font-bold rounded-full text-dark/70">
                🏋️ {workout.muscleGroup || 'Trup i Plotë'}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-xs font-bold rounded-full text-dark/70">
                ⚡ {workout.difficulty || workout.difficultyLevel || 'Beginner'}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-xs font-bold rounded-full text-dark/70">
                ⏱️ {workout.durationSeconds ? `${Math.round(workout.durationSeconds / 60)} min` : 'N/A'}
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed pt-3 text-sm">
              {workout.description || 'Nuk ka asnjë përshkrim shtesë për këtë stërvitje.'}
            </p>
          </div>

          <hr className="border-gray-100" />

          <WorkoutTimer 
            status={status} 
            elapsedSeconds={elapsedSeconds} 
            liveCalories={liveCalories}
            disabled={disabled}
            onStart={() => setStatus('running')}
            onPause={() => setStatus('paused')}
            onResume={() => setStatus('running')}
            onFinish={handleFinishWorkout}
            onReset={() => { setElapsedSeconds(0); setLiveCalories(0); setStatus('idle'); }}
          />
        </div>

        {/* KOLONA ANËSORE (Djathtas) */}
        <div className="space-y-6">
          <WorkoutStats workout={workout} />
          <SessionStatsCard stats={workout.stats || workout} loading={false} />
          <RelatedWorkouts currentWorkout={workout} />
        </div>

      </div>
    </motion.div>
  );
}