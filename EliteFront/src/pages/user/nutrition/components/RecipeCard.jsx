import { useNavigate } from 'react-router-dom';
import { Clock, Flame, Users, Star } from 'lucide-react';

const DIET_COLORS = {
  Vegan:       'bg-green-100 text-green-700',
  Vegetarian:  'bg-lime-100  text-lime-700',
  Keto:        'bg-purple-100 text-purple-700',
  Paleo:       'bg-orange-100 text-orange-700',
  Standard:    'bg-gray-100  text-gray-600',
};

export function RecipeCard({ recipe }) {
  const navigate = useNavigate();
  const totalTime = (recipe.prepTimeMin ?? 0) + (recipe.cookTimeMin ?? 0);

  return (
    <div
      onClick={() => navigate(`/user/nutrition/${recipe.id}`)}
      className="group bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden cursor-pointer
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">
            🍽️
          </div>
        )}

        {/* Featured star */}
        {recipe.isFeatured && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5
                          bg-amber-400 rounded-full text-white text-[10px] font-bold shadow">
            <Star size={9} fill="currentColor" />
            Featured
          </div>
        )}

        {/* Category badge */}
        {recipe.category && (
          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full
                          bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold">
            {recipe.category}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5">
        {/* Diet type + allergen count */}
        <div className="flex items-center gap-1.5 mb-1.5">
          {recipe.dietType && recipe.dietType !== 'Standard' && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIET_COLORS[recipe.dietType] ?? DIET_COLORS.Standard}`}>
              {recipe.dietType}
            </span>
          )}
          {recipe.allergens?.length > 0 && (
            <span className="text-[10px] text-dark/35 font-medium">
              Contains {recipe.allergens.join(', ')}
            </span>
          )}
        </div>

        <h3 className="font-bold text-dark text-[13px] leading-snug line-clamp-2 mb-2">
          {recipe.title}
        </h3>

        {/* Macros row */}
        <div className="flex items-center gap-3 text-[11px] text-dark/50 font-medium">
          {recipe.calories != null && (
            <span className="flex items-center gap-1">
              <Flame size={11} className="text-orange-400" />
              {recipe.calories} kcal
            </span>
          )}
          {totalTime > 0 && (
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-sky" />
              {totalTime} min
            </span>
          )}
          {recipe.servingsCount != null && (
            <span className="flex items-center gap-1">
              <Users size={11} className="text-dark/40" />
              {recipe.servingsCount}
            </span>
          )}
        </div>

        {/* Macro breakdown */}
        {(recipe.proteinG != null || recipe.carbsG != null || recipe.fatG != null) && (
          <div className="mt-2.5 flex gap-2">
            {recipe.proteinG != null && (
              <MacroChip label="P" value={`${recipe.proteinG}g`} color="text-sky" />
            )}
            {recipe.carbsG != null && (
              <MacroChip label="C" value={`${recipe.carbsG}g`} color="text-amber-500" />
            )}
            {recipe.fatG != null && (
              <MacroChip label="F" value={`${recipe.fatG}g`} color="text-rose-400" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MacroChip({ label, value, color }) {
  return (
    <div className="flex items-center gap-0.5 bg-gray-50 rounded-lg px-1.5 py-0.5">
      <span className={`text-[10px] font-bold ${color}`}>{label}</span>
      <span className="text-[10px] text-dark/50 font-medium">{value}</span>
    </div>
  );
}
