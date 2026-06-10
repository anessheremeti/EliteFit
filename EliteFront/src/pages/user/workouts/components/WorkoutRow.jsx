import { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { WorkoutCard } from './WorkoutCard';

export function WorkoutRow({ title, workouts = [], loading = false }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 260, behavior: 'smooth' });
  };

  // Loader-i i rreshtit (Skeleton) i përshtatur me strukturën e re të kartës
  if (loading) {
    return (
      <section className="mb-6">
        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-3" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-none w-[210px] sm:w-[230px] bg-white border border-black/5 rounded-2xl p-3 space-y-3 shadow-sm">
              <div className="aspect-video w-full bg-gray-100 rounded-xl animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Nëse nuk ka asnjë video në këtë kategori/rresht, nuk shfaqet fare në faqe
  if (!workouts.length) return null;

  return (
    <section className="group/row mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <h2 className="text-lg font-bold text-dark">{title}</h2>
          <span className="text-sm text-dark/40">{workouts.length}</span>
        </div>
        
        {/* Shpizat (shigjetat) për lëvizje majtas-djathtas */}
        <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            onClick={() => scroll(-1)}
            className="p-1.5 rounded-lg text-dark/50 hover:text-dark hover:bg-white border border-transparent hover:border-gray-200 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="p-1.5 rounded-lg text-dark/50 hover:text-dark hover:bg-white border border-transparent hover:border-gray-200 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Kontenieri horizontal i videove */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {workouts.map(workout => (
          // workout.id vjen nga backend në camelCase si "id"
          <div key={workout.id} className="flex-none w-[210px] sm:w-[230px]">
            <WorkoutCard workout={workout} />
          </div>
        ))}
      </div>
    </section>
  );
}