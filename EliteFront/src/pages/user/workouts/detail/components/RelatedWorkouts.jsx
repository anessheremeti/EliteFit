import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=70';

const DIFFICULTY_DOT = {
  Beginner:     'bg-emerald-400',
  Intermediate: 'bg-amber-400',
  Advanced:     'bg-rose-400',
};

function SkeletonCard() {
  return (
    <div className="flex gap-3 p-3 animate-pulse">
      <div className="w-20 h-14 rounded-xl bg-gray-100 shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-2.5 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

export function RelatedWorkouts({ items, loading }) {
  if (!loading && (!items || items.length === 0)) return null;

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
      <div className="px-5 pt-4 pb-2 border-b border-black/5">
        <h3 className="text-sm font-bold text-dark">More Workouts</h3>
      </div>

      <div className="divide-y divide-black/5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : items.map(w => (
              <Link
                key={w.id}
                to={`/user/workouts/${w.id}`}
                className="flex gap-3 p-3 hover:bg-surface transition-colors group"
              >
                {/* Thumbnail */}
                <div className="w-20 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={w.thumbnailUrl || PLACEHOLDER}
                    alt={w.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                  <p className="text-sm font-semibold text-dark leading-snug line-clamp-2">{w.title}</p>
                  <div className="flex items-center gap-2 text-xs text-dark/40">
                    <span className={`w-1.5 h-1.5 rounded-full ${DIFFICULTY_DOT[w.difficulty] ?? 'bg-gray-300'}`} />
                    <span>{w.difficulty}</span>
                    <span>•</span>
                    <Clock size={11} />
                    <span>{w.durationMin} min</span>
                  </div>
                </div>

                <ChevronRight size={16} className="text-dark/20 self-center shrink-0 group-hover:text-sky transition-colors" />
              </Link>
            ))}
      </div>
    </div>
  );
}
