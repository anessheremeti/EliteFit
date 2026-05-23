import { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { WorkoutCard } from './WorkoutCard';

export function WorkoutRow({ title, workouts = [], loading = false }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 260, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section>
        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-3" />
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-none w-[210px] aspect-video rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!workouts.length) return null;

  return (
    <section className="group/row">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <h2 className="text-lg font-bold text-dark">{title}</h2>
          <span className="text-sm text-dark/40">{workouts.length}</span>
        </div>
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

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {workouts.map(workout => (
          <div key={workout.id} className="flex-none w-[210px] sm:w-[230px]">
            <WorkoutCard workout={workout} />
          </div>
        ))}
      </div>
    </section>
  );
}
