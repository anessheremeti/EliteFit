import { Clock, Flame, Dumbbell, Tag, Zap } from 'lucide-react';

const DIFFICULTY_COLOR = {
  Beginner:     'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-amber-100  text-amber-700',
  Advanced:     'bg-rose-100   text-rose-700',
};

function Stat({ icon: Icon, label, value, extra }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-black/5 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-sky/10 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-sky" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-dark/40 font-medium uppercase tracking-wide leading-none mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-dark leading-snug">{value}</p>
      </div>
      {extra}
    </div>
  );
}

export function WorkoutStats({ workout }) {
  const diffClass = DIFFICULTY_COLOR[workout.difficulty] ?? 'bg-gray-100 text-gray-600';

  // Kthejmë sekondat nga DB në minuta
  const durationMin = workout.durationSeconds 
    ? Math.round(workout.durationSeconds / 60) 
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 space-y-1">
      <h3 className="text-sm font-bold text-dark mb-3">Workout Details</h3>

      {/* Kohëzgjatja në minuta */}
      <Stat icon={Clock} label="Duration" value={`${durationMin} min`} />
      
      {/* Vështirësia */}
      <Stat
        icon={Flame}
        label="Difficulty"
        value={workout.difficulty || 'Beginner'}
        extra={
          <span className={`ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full ${diffClass}`}>
            {workout.difficulty || 'Beginner'}
          </span>
        }
      />
      
      {/* Kategoria dhe Grupet Muskujve nëse vijnë nga API */}
      {workout.category && <Stat icon={Tag} label="Category" value={workout.category} />}
      {workout.muscleGroup && <Stat icon={Dumbbell} label="Muscle Group" value={workout.muscleGroup} />}
      
      {/* Titulli i ushtrimit / videos kryesore */}
      {workout.title && <Stat icon={Zap} label="Exercise" value={workout.title} />}

      {/* Përshkrimi i stërvitjes */}
      {workout.description && (
        <div className="pt-3 border-t border-black/5 mt-2">
          <p className="text-xs text-dark/40 font-medium uppercase tracking-wide mb-1.5">About</p>
          <p className="text-sm text-dark/70 leading-relaxed">{workout.description}</p>
        </div>
      )}
    </div>
  );
}