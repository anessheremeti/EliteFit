import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play } from 'lucide-react';

const DIFFICULTY_BADGE = {
  Beginner:     'bg-emerald-400',
  Intermediate: 'bg-amber-400',
  Advanced:     'bg-rose-400',
};

const PLACEHOLDER = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80';

export function WorkoutCard({ workout }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [liked,   setLiked]   = useState(workout.isFavorited ?? false);

  const thumbnail = workout.thumbnailUrl || workout.thumbnail || PLACEHOLDER;

  // Llogaritja e minutave nga sekondat që vijnë nga DB (durationSeconds)
  const durationMin = workout.durationSeconds 
    ? Math.round(workout.durationSeconds / 60) 
    : 0;

  const handleClick = () => navigate(`/users/workouts/${workout.id}`);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(v => !v);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm cursor-pointer group"
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 380, damping: 24 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={thumbnail}
          alt={workout.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Duration badge - e kthyer në minuta */}
        <span className="absolute top-2 left-2 bg-black/60 text-white text-[11px] font-medium px-2 py-0.5 rounded-lg backdrop-blur-sm">
          {durationMin} min
        </span>

        {/* Difficulty badge */}
        <span className={`absolute top-2 right-2 ${DIFFICULTY_BADGE[workout.difficulty] ?? 'bg-gray-400'} text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full`}>
          {workout.difficulty}
        </span>

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <div className="flex items-center gap-2 bg-white/90 text-dark px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                <Play size={14} fill="currentColor" />
                Start Workout
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info row */}
      <div className="px-3 py-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-dark/40 font-medium mb-0.5">{workout.difficulty}</p>
          <p className="text-sm font-semibold text-dark leading-snug truncate">{workout.title}</p>
          
          {/* Shfaq kaloritë nëse ekzistojnë në DB */}
          {workout.estimatedCaloriesBurned && (
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              🔥 {workout.estimatedCaloriesBurned} kcal
            </p>
          )}
        </div>
        <button
          onClick={handleLike}
          className="mt-0.5 p-1 rounded-full hover:bg-surface transition-colors flex-none"
          aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            size={16}
            className={liked ? 'fill-pink text-pink' : 'text-dark/30'}
          />
        </button>
      </div>
    </motion.div>
  );
}