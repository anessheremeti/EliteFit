import { useNavigate } from 'react-router-dom';
import { Clock, Flame, Users, Star } from 'lucide-react';

const DIET_COLORS = {
  Vegan:      'bg-green-100 text-green-700',
  Vegetarian: 'bg-lime-100  text-lime-700',
  Keto:       'bg-purple-100 text-purple-700',
  Pale:      'bg-orange-100 text-orange-700',
  Standard:   'bg-gray-100  text-gray-600',
};

export function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  const BACKEND_BASE_URL = 'https://localhost:7049';

  // Sigurohemi që kapim ID-në pa pasur problem shkronjat e mëdha/vogla
  const recipeId = recipe.id || recipe.Id;
  const title = recipe.title || recipe.Title || 'Pa titull';
  const calories = recipe.calories !== undefined ? recipe.calories : recipe.Calories;
  
  const protein = recipe.proteinG ?? recipe.ProteinG ?? recipe.protein_g;
  const carbs = recipe.carbsG ?? recipe.CarbsG ?? recipe.carbs_g;
  const fat = recipe.fatG ?? recipe.FatG ?? recipe.fat_g;

  const prepTime = recipe.prepTimeMin ?? recipe.PrepTimeMin ?? 0;
  const cookTime = recipe.cookTimeMin ?? recipe.CookTimeMin ?? 0;
  const totalTime = prepTime + cookTime;

  const servingsCount = recipe.servingsCount ?? recipe.ServingsCount;
  const isFeatured = recipe.isFeatured ?? recipe.IsFeatured;
  const category = recipe.category ?? recipe.Category;
  const dietType = recipe.dietType ?? recipe.DietType ?? 'Standard';
  
  const allergens = recipe.allergens || recipe.Allergens || [];

  // RREGULLIMI I FOTOS: Evitimi i rreptë i double-slash ("//")
  const rawImageUrl = recipe.imageUrl || recipe.ImageUrl;
  let finalImageUrl = null;

  if (rawImageUrl) {
    if (rawImageUrl.startsWith('http')) {
      finalImageUrl = rawImageUrl;
    } else {
      const cleanPath = rawImageUrl.replace(/\\/g, '/');
      const hasLeadingSlash = cleanPath.startsWith('/');
      finalImageUrl = `${BACKEND_BASE_URL}${hasLeadingSlash ? '' : '/'}${cleanPath}`;
    }
  }

  return (
    <div
      onClick={() => navigate(`/users/nutrition/${recipeId}`)}
      className="group bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden cursor-pointer
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {finalImageUrl ? (
          <img
            src={finalImageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">
            🍽️
          </div>
        )}

        {/* Featured star */}
        {isFeatured && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5
                          bg-amber-400 rounded-full text-white text-[10px] font-bold shadow">
            <Star size={9} fill="currentColor" />
            Featured
          </div>
        )}

        {/* Category badge */}
        {category && (
          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full
                          bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold">
            {category}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5">
        {/* Diet type + allergen count */}
        <div className="flex items-center gap-1.5 mb-1.5">
          {dietType && dietType !== 'Standard' && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIET_COLORS[dietType] ?? DIET_COLORS.Standard}`}>
              {dietType}
            </span>
          )}
          {allergens.length > 0 && (
            <span className="text-[10px] text-dark/35 font-medium line-clamp-1">
              Contains {typeof allergens[0] === 'object' ? 'Allergens' : allergens.join(', ')}
            </span>
          )}
        </div>

        <h3 className="font-bold text-dark text-[13px] leading-snug line-clamp-2 mb-2">
          {title}
        </h3>

        {/* Macros row */}
        <div className="flex items-center gap-3 text-[11px] text-dark/50 font-medium">
          {calories != null && (
            <span className="flex items-center gap-1">
              <Flame size={11} className="text-orange-400" />
              {calories} kcal
            </span>
          )}
          {totalTime > 0 && (
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-sky" />
              {totalTime} min
            </span>
          )}
          {servingsCount != null && (
            <span className="flex items-center gap-1">
              <Users size={11} className="text-dark/40" />
              {servingsCount}
            </span>
          )}
        </div>

        {/* Macro breakdown */}
        {(protein != null || carbs != null || fat != null) && (
          <div className="mt-2.5 flex gap-2">
            {protein != null && (
              <MacroChip label="P" value={`${protein}g`} color="text-sky" />
            )}
            {carbs != null && (
              <MacroChip label="C" value={`${carbs}g`} color="text-amber-500" />
            )}
            {fat != null && (
              <MacroChip label="F" value={`${fat}g`} color="text-rose-400" />
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