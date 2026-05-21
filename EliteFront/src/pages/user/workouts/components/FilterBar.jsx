import { ChevronDown } from 'lucide-react';

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2.5 px-3.5 py-2 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer pointer-events-none">
        <div>
          <p className="text-[10px] text-dark/40 font-medium leading-none mb-0.5">{label}</p>
          <p className="text-sm font-semibold text-dark leading-none whitespace-nowrap">{value}</p>
        </div>
        <ChevronDown size={14} className="text-dark/40 flex-none" />
      </div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full"
        aria-label={label}
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

export function FilterBar({
  categories   = ['All'],
  difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'],
  muscleGroups = ['All', 'Full Body', 'Upper Body', 'Lower Body', 'Core', 'Back'],
  durations    = ['All', '< 15 min', '15–30 min', '30–45 min', '45–60 min', '60+ min'],
  category, difficulty, muscleGroup, duration,
  onCategoryChange, onDifficultyChange, onMuscleGroupChange, onDurationChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">

      <div className="flex items-center gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-150 ${
              category === cat
                ? 'bg-dark text-white border-dark shadow-sm'
                : 'bg-white text-dark/65 border-gray-200 hover:border-gray-300 hover:text-dark'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <FilterSelect label="Difficulty"   value={difficulty}  options={difficulties} onChange={onDifficultyChange} />
        <FilterSelect label="Muscle Group" value={muscleGroup} options={muscleGroups} onChange={onMuscleGroupChange} />
        <FilterSelect label="Duration"     value={duration}    options={durations}    onChange={onDurationChange} />
      </div>

    </div>
  );
}
