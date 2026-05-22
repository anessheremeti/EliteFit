import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, Flame, Users, Star,
  ShieldAlert, CheckCircle2, ChefHat,
  Dumbbell, BookOpen,
} from 'lucide-react';
import { recipeService } from '../../../../services/recipeService';

// ── Difficulty config ─────────────────────────────────────────────────────────
const DIFFICULTY_CONFIG = {
  Easy:   { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  Medium: { color: 'text-amber-600 bg-amber-50 border-amber-200',       dot: 'bg-amber-500'   },
  Hard:   { color: 'text-rose-600 bg-rose-50 border-rose-200',          dot: 'bg-rose-500'    },
};

const DIET_COLORS = {
  Vegan:       'bg-green-100 text-green-700',
  Vegetarian:  'bg-lime-100  text-lime-700',
  Keto:        'bg-purple-100 text-purple-700',
  Paleo:       'bg-orange-100 text-orange-700',
  Standard:    'bg-gray-100  text-gray-600',
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-72 sm:h-96 bg-gray-100 rounded-3xl" />
      <div className="space-y-3 px-1">
        <div className="h-4 bg-gray-100 rounded w-1/4" />
        <div className="h-7 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
        <div className="flex gap-3 pt-2">
          {[1,2,3,4].map(i => <div key={i} className="h-16 flex-1 bg-gray-100 rounded-2xl" />)}
        </div>
      </div>
      <div className="h-32 bg-gray-100 rounded-2xl" />
      <div className="h-48 bg-gray-100 rounded-2xl" />
      <div className="h-64 bg-gray-100 rounded-2xl" />
    </div>
  );
}

// ── Stat chip ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent = 'text-dark' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-3 px-2
                    bg-white rounded-2xl border border-black/5 shadow-sm text-center">
      <span className={`${accent}`}>{icon}</span>
      <span className="text-[13px] font-bold text-dark leading-none">{value}</span>
      <span className="text-[10px] text-dark/40 font-medium leading-none">{label}</span>
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ icon, title, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl border border-black/5 shadow-sm p-5 space-y-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-sky">{icon}</span>
        <h2 className="text-sm font-bold text-dark">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function RecipeDetailPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [recipe,   setRecipe]  = useState(null);
  const [loading,  setLoading] = useState(true);
  const [error,    setError]   = useState(null);
  const [checked,  setChecked] = useState({});

  useEffect(() => {
    setLoading(true);
    setError(null);
    recipeService.getById(id)
      .then(data => setRecipe(data))
      .catch(err => setError(err.message || 'Could not load recipe.'))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleIngredient = (idx) =>
    setChecked(prev => ({ ...prev, [idx]: !prev[idx] }));

  const totalTime = recipe
    ? (recipe.prepTimeMin ?? 0) + (recipe.cookTimeMin ?? 0)
    : 0;

  const diffConfig = recipe?.difficultyLevel
    ? (DIFFICULTY_CONFIG[recipe.difficultyLevel] ?? DIFFICULTY_CONFIG.Easy)
    : null;

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-5 space-y-5">

        {/* Back button */}
        <button
          onClick={() => navigate('/user/nutrition')}
          className="flex items-center gap-1.5 text-sm text-dark/50 hover:text-dark
                     font-semibold transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Recipes
        </button>

        {loading && <DetailSkeleton />}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-24 text-dark/30 gap-3">
            <span className="text-5xl">😔</span>
            <p className="text-sm font-medium text-dark/40">{error}</p>
            <button
              onClick={() => navigate('/user/nutrition')}
              className="text-xs text-sky font-semibold hover:underline"
            >
              Browse all recipes
            </button>
          </div>
        )}

        {recipe && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {/* Hero image */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-3xl bg-gray-100">
              {recipe.imageUrl ? (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
                  🍽️
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {recipe.isFeatured && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-400 rounded-full
                                   text-white text-[11px] font-bold shadow-sm">
                    <Star size={10} fill="currentColor" />
                    Featured
                  </span>
                )}
                {recipe.category && (
                  <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm
                                   text-white text-[11px] font-semibold">
                    {recipe.category}
                  </span>
                )}
                {recipe.dietType && recipe.dietType !== 'Standard' && (
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold
                                   ${DIET_COLORS[recipe.dietType] ?? DIET_COLORS.Standard}`}>
                    {recipe.dietType}
                  </span>
                )}
              </div>

              {/* Title on image bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h1 className="text-white text-xl sm:text-2xl font-bold font-heading
                               drop-shadow leading-snug">
                  {recipe.title}
                </h1>
              </div>
            </div>

            {/* Stat cards */}
            <div className={`grid gap-3 ${diffConfig ? 'grid-cols-4' : 'grid-cols-3'}`}>
              {totalTime > 0 && (
                <StatCard
                  icon={<Clock size={18} />}
                  label="Total time"
                  value={`${totalTime} min`}
                  accent="text-sky"
                />
              )}
              {recipe.servingsCount != null && (
                <StatCard
                  icon={<Users size={18} />}
                  label="Servings"
                  value={recipe.servingsCount}
                  accent="text-dark/50"
                />
              )}
              {recipe.calories != null && (
                <StatCard
                  icon={<Flame size={18} />}
                  label="Calories"
                  value={`${recipe.calories} kcal`}
                  accent="text-orange-400"
                />
              )}
              {diffConfig && (
                <StatCard
                  icon={<ChefHat size={18} />}
                  label="Difficulty"
                  value={recipe.difficultyLevel}
                  accent={diffConfig.color.split(' ')[0]}
                />
              )}
            </div>

            {/* Description */}
            {recipe.description && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-dark/60 leading-relaxed px-1"
              >
                {recipe.description}
              </motion.p>
            )}

            {/* Allergen warning */}
            {recipe.allergens?.length > 0 && (
              <div className="flex items-start gap-3 px-4 py-3.5
                              bg-rose-50 border border-rose-100 rounded-2xl">
                <ShieldAlert size={16} className="text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-rose-700 mb-0.5">Contains allergens</p>
                  <p className="text-xs text-rose-600">
                    {recipe.allergens.join(' · ')}
                  </p>
                </div>
              </div>
            )}

            {/* Nutrition */}
            {(recipe.calories != null || recipe.proteinG != null ||
              recipe.carbsG  != null || recipe.fatG    != null) && (
              <Section icon={<Flame size={16} />} title="Nutrition per serving">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {recipe.calories != null && (
                    <NutritionBar label="Calories" value={`${recipe.calories}`} unit="kcal"
                                  barColor="bg-orange-400" pct={100} />
                  )}
                  {recipe.proteinG != null && (
                    <NutritionBar label="Protein" value={recipe.proteinG} unit="g"
                                  barColor="bg-sky" pct={macroPercent(recipe.proteinG, recipe.carbsG, recipe.fatG)} />
                  )}
                  {recipe.carbsG != null && (
                    <NutritionBar label="Carbs" value={recipe.carbsG} unit="g"
                                  barColor="bg-amber-400" pct={macroPercent(recipe.carbsG, recipe.proteinG, recipe.fatG)} />
                  )}
                  {recipe.fatG != null && (
                    <NutritionBar label="Fat" value={recipe.fatG} unit="g"
                                  barColor="bg-rose-400" pct={macroPercent(recipe.fatG, recipe.proteinG, recipe.carbsG)} />
                  )}
                </div>
              </Section>
            )}

            {/* Time breakdown */}
            {(recipe.prepTimeMin > 0 || recipe.cookTimeMin > 0) && (
              <div className="grid grid-cols-2 gap-3">
                {recipe.prepTimeMin > 0 && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl
                                  border border-black/5 shadow-sm">
                    <Clock size={16} className="text-sky shrink-0" />
                    <div>
                      <p className="text-[11px] text-dark/40 font-medium">Prep time</p>
                      <p className="text-sm font-bold text-dark">{recipe.prepTimeMin} min</p>
                    </div>
                  </div>
                )}
                {recipe.cookTimeMin > 0 && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl
                                  border border-black/5 shadow-sm">
                    <Flame size={16} className="text-orange-400 shrink-0" />
                    <div>
                      <p className="text-[11px] text-dark/40 font-medium">Cook time</p>
                      <p className="text-sm font-bold text-dark">{recipe.cookTimeMin} min</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Ingredients */}
            {recipe.ingredients?.length > 0 && (
              <Section icon={<BookOpen size={16} />} title={`Ingredients · ${recipe.ingredients.length} items`}>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ing, idx) => (
                    <li
                      key={idx}
                      onClick={() => toggleIngredient(idx)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer
                                  transition-all duration-150 select-none
                                  ${checked[idx]
                                    ? 'bg-emerald-50 border border-emerald-100'
                                    : 'bg-gray-50 border border-transparent hover:border-black/5'}`}
                    >
                      <CheckCircle2
                        size={18}
                        className={`shrink-0 transition-colors ${
                          checked[idx] ? 'text-emerald-500' : 'text-dark/20'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-semibold transition-colors ${
                          checked[idx] ? 'line-through text-dark/30' : 'text-dark'
                        }`}>
                          {ing.name}
                        </span>
                        {ing.notes && (
                          <span className="text-xs text-dark/40 ml-1">({ing.notes})</span>
                        )}
                      </div>
                      {(ing.amount || ing.unit) && (
                        <span className={`text-xs font-bold shrink-0 transition-colors ${
                          checked[idx] ? 'text-dark/25' : 'text-sky'
                        }`}>
                          {[ing.amount, ing.unit].filter(Boolean).join(' ')}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="text-[10px] text-dark/30 text-center pt-1">
                  Tap an ingredient to check it off
                </p>
              </Section>
            )}

            {/* Steps */}
            {recipe.steps?.length > 0 && (
              <Section icon={<Dumbbell size={16} />} title="Instructions">
                <ol className="space-y-3">
                  {recipe.steps.map((step, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.2 }}
                      className="flex gap-3"
                    >
                      <span className="shrink-0 w-7 h-7 rounded-full bg-sky text-white
                                       text-xs font-bold flex items-center justify-center
                                       mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-dark/70 leading-relaxed pt-1">{step}</p>
                    </motion.li>
                  ))}
                </ol>
              </Section>
            )}

            {/* Bottom spacer */}
            <div className="h-6" />
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function macroPercent(value, ...others) {
  const total = [value, ...others].reduce((s, v) => s + (v ?? 0), 0);
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

function NutritionBar({ label, value, unit, barColor, pct }) {
  return (
    <div className="flex flex-col gap-1.5 p-3 bg-gray-50 rounded-2xl">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] text-dark/40 font-medium">{label}</span>
        <span className="text-sm font-bold text-dark">
          {value}<span className="text-[10px] font-medium text-dark/40 ml-0.5">{unit}</span>
        </span>
      </div>
      <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
    </div>
  );
}
