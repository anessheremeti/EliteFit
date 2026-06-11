import { Clock, Flame, Dumbbell, Tag, Zap } from 'lucide-react';

const DIFFICULTY_COLOR = {
  Beginner:     'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-amber-100  text-amber-700',
  Advanced:     'bg-rose-100   text-rose-700',
};

function Stat({ icon: Icon, label, value, extra }) {
  if (!value) return null; // Nëse një vlerë nuk vjen nga backend-i, rreshti nuk shfaqet fare
  
  return (
    <div className="flex items-center gap-3 py-3 border-b border-black/5 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-sky/10 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-sky" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-dark/40 font-medium uppercase tracking-wide leading-none mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-dark leading-snug truncate">{value}</p>
      </div>
      {extra}
    </div>
  );
}

export function WorkoutStats({ workout }) {
  // 1. Kontroll sigurie: Nëse workout nuk është ngarkuar ende nga API, shfaqet një gjendje boshe
  if (!workout) {
    return (
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 animate-pulse space-y-3">
        <div className="h-4 w-24 bg-gray-100 rounded" />
        <div className="h-10 w-full bg-gray-50 rounded" />
        <div className="h-10 w-full bg-gray-50 rounded" />
      </div>
    );
  }

  // Përshtatja me vështirësinë nga Backend-i
  const difficultyValue = workout.difficulty || workout.difficultyLevel || 'Beginner';
  const diffClass = DIFFICULTY_COLOR[difficultyValue] ?? 'bg-gray-100 text-gray-600';

  // Kthejmë sekondat nga DB në minuta
  const durationMin = workout.durationSeconds 
    ? Math.round(workout.durationSeconds / 60) 
    : 0;

  // Trajtim i sigurt për kategorinë nëse vjen si string apo si objekt i lidhur (Navigation Property)
  const categoryDisplay = typeof workout.category === 'object' 
    ? workout.category?.name 
    : workout.category;

  // Kaloritë e marra direkt nga emërtimi i Backend-it tënd (estimatedCaloriesBurned)
  const caloriesDisplay = workout.estimatedCaloriesBurned 
    ? `${workout.estimatedCaloriesBurned} kcal` 
    : null;

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 space-y-1">
      <h3 className="text-sm font-bold text-dark mb-3">Workout Details</h3>

      {/* Kohëzgjatja në minuta */}
      <Stat icon={Clock} label="Duration" value={durationMin > 0 ? `${durationMin} min` : '—'} />
      
      {/* Vështirësia (Përdor Zap për intensitetin dhe Badge në të djathtë) */}
      <Stat
        icon={Zap}
        label="Difficulty"
        value=" " // Lihet bosh tek teksti që të mos përsëritet, pasi shfaqet te badge djathtas
        extra={
          <span className={`ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full ${diffClass}`}>
            {difficultyValue}
          </span>
        }
      />

      {/* Kaloritë e Djegura (Shtuar sipas modelit tënd në DB) */}
      <Stat icon={Flame} label="Est. Calories" value={caloriesDisplay} />
      
      {/* Kategoria dhe Grupet Muskujve nëse vijnë nga API */}
      <Stat icon={Tag} label="Category" value={categoryDisplay} />
      <Stat icon={Dumbbell} label="Muscle Group" value={workout.muscleGroup} />
      
      {/* Titulli i ushtrimit / videos kryesore */}
      <Stat icon={Zap} label="Exercise Title" value={workout.title} />

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