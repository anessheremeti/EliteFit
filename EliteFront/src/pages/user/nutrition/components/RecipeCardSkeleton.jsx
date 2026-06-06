import React from 'react';

export function RecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden animate-pulse">
      {/* Zona e fotos */}
      <div className="aspect-[4/3] bg-gray-100" />
      
      {/* Pjesa e tekstit dhe info */}
      <div className="p-3.5 space-y-2">
        <div className="h-2.5 bg-gray-100 rounded w-1/3" />
        <div className="h-3.5 bg-gray-100 rounded w-4/5" />
        <div className="h-3.5 bg-gray-100 rounded w-3/5" />
        
        {/* Skeletet për makronutrientët (Protein, Carbs, Fat) */}
        <div className="flex gap-2 mt-1">
          <div className="h-5 bg-gray-100 rounded-lg w-10" />
          <div className="h-5 bg-gray-100 rounded-lg w-10" />
          <div className="h-5 bg-gray-100 rounded-lg w-10" />
        </div>
      </div>
    </div>
  );
}

// Kjo zgjidh gabimin e importit në index.jsx
export default RecipeCardSkeleton;
