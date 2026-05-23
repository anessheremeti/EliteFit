import { Search, X } from 'lucide-react';

const DIET_TYPES = ['All', 'Standard', 'Vegan', 'Vegetarian', 'Keto', 'Paleo'];

export function RecipeFilterBar({
  categories = [],
  category,   onCategoryChange,
  dietType,   onDietTypeChange,
  search,     onSearchChange,
}) {
  const hasFilters = category !== 'All' || dietType !== 'All' || !!search;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark/30 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search recipes..."
          className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-black/10 bg-white
                     text-dark text-sm placeholder-dark/30 font-sans
                     focus:outline-none focus:ring-2 focus:ring-sky/20 focus:border-sky/40
                     transition-all duration-200"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', ...categories.filter(c => c !== 'All')].map(c => (
          <Chip
            key={c}
            label={c}
            active={category === c}
            onClick={() => onCategoryChange(c)}
          />
        ))}
      </div>

      {/* Diet type chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DIET_TYPES.map(d => (
          <Chip
            key={d}
            label={d}
            active={dietType === d}
            onClick={() => onDietTypeChange(d)}
            variant="diet"
          />
        ))}
        {hasFilters && (
          <button
            onClick={() => {
              onCategoryChange('All');
              onDietTypeChange('All');
              onSearchChange('');
            }}
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs
                       font-semibold text-rose-500 border border-rose-200 hover:bg-rose-50 transition-colors"
          >
            <X size={11} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

function Chip({ label, active, onClick, variant = 'category' }) {
  const base = 'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap';
  const styles = active
    ? 'bg-sky text-black shadow-sm'
    : 'bg-white border border-black/10 text-dark/60 hover:border-sky/40 hover:text-sky';
  return (
    <button className={`${base} ${styles}`} onClick={onClick}>
      {label}
    </button>
  );
}
