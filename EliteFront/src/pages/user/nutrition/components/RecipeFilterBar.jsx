import React from 'react';
import { Search, X } from 'lucide-react';

export function RecipeFilterBar({ search, onSearchChange }) {
  return (
    <div className="relative w-full max-w-xl">
      <Search 
        size={16} 
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
      />
      <input
        type="text"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="Kërko receta sipas titullit..."
        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-black/10 bg-white
                   text-dark text-sm placeholder-gray-400 font-sans
                   focus:outline-none focus:ring-2 focus:ring-sky/20 focus:border-sky/40
                   transition-all duration-200"
      />
      {search && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}