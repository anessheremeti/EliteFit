import { ChevronDown, Search } from 'lucide-react';

function FilterSelect({ label, value, options = ['All'], onChange }) {
  // RREGULLIM: Kjo pjesë siguron që në UI të shfaqet Label-i i bukur (p.sh "Sipas Kalorive")
  // por vlerë reale në background të mbetet kodi (p.sh "calories")
  const displayValue = typeof options[0] === 'object'
    ? (options.find(o => o.value === value)?.label || 'Default')
    : value;

  return (
    <div className="relative">
      <div className="flex items-center gap-2.5 px-3.5 py-2 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer pointer-events-none">
        <div>
          <p className="text-[10px] text-dark/40 font-medium leading-none mb-0.5">{label}</p>
          <p className="text-sm font-semibold text-dark leading-none whitespace-nowrap">{displayValue}</p>
        </div>
        <ChevronDown size={14} className="text-dark/40 flex-none" />
      </div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full"
        aria-label={label}
      >
        {options.map(opt => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export function FilterBar({
  categories = ['All'],
  difficulties = ['All'],
  muscleGroups = ['All'],
  durations = ['All'],
  
  category, 
  difficulty, 
  muscleGroup, 
  duration,
  searchQuery, 
  sortBy,      

  onCategoryChange, 
  onDifficultyChange, 
  onMuscleGroupChange, 
  onDurationChange,
  onSearchChange, 
  onSortByChange, 
}) {

  // Këtu ruajmë vlerat ekzakte që pret API në C# (value) dhe përkthimin për UI (label)
  const sortOptions = [
    { value: '', label: 'Default (Më të rejat)' },
    { value: 'short', label: 'Më të shkurtra' },
    { value: 'long', label: 'Më të gjata' },
    { value: 'calories', label: 'Sipas Kalorive' }
  ];

  // RREGULLIM: Pastrimi i duplikateve "All" nëse vijnë nga backend-i apo frontend-i gabimisht
  const cleanDurations = [...new Set(durations)];
  const cleanDifficulties = [...new Set(difficulties)];
  const cleanMuscleGroups = [...new Set(muscleGroups)];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark/40" />
        <input
          type="text"
          placeholder="Kërko stërvitje sipas titullit ose përshkrimit..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-gray-300 transition-colors"
        />
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        
        {/* Kategoritë (Butonat si "All", "Upper Body") */}
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

        {/* Dropdown-at e Filtrave */}
        <div className="flex items-center gap-2 flex-wrap">
          <FilterSelect 
            label="Difficulty"   
            value={difficulty}   
            options={cleanDifficulties} 
            onChange={onDifficultyChange} 
          />
          <FilterSelect 
            label="Muscle Group" 
            value={muscleGroup}  
            options={cleanMuscleGroups} 
            onChange={onMuscleGroupChange} 
          />
          <FilterSelect 
            label="Duration"     
            value={duration}     
            options={cleanDurations}    
            onChange={onDurationChange} 
          />
          {/* RREGULLIM KRITIK: Këtu i kalohet 'sortBy' e pastër ('calories', 'short') dhe jo label-i shqip */}
          <FilterSelect 
            label="Sort By"     
            value={sortBy}     
            options={sortOptions}    
            onChange={onSortByChange} 
          />
        </div>

      </div>
    </div>
  );
}