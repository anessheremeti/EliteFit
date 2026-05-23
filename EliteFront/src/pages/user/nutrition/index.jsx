import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { RecipeCard }         from './components/RecipeCard';
import { RecipeCardSkeleton } from './components/RecipeCardSkeleton';
import { RecipeFilterBar }    from './components/RecipeFilterBar';
import { recipeService }      from '../../../services/recipeService';

const PAGE_SIZE = 12;

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.04 } },
};
const cardItem = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.22 } },
};

export default function RecipeFeedPage() {
  const [recipes,    setRecipes]    = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  const [category,  setCategory]  = useState('All');
  const [dietType,  setDietType]  = useState('All');
  const [search,    setSearch]    = useState('');
  const [page,      setPage]      = useState(1);

  // Load categories once
  useEffect(() => {
    recipeService.getCategories()
      .then(cats => setCategories(['All', ...cats]))
      .catch(() => {});
  }, []);

  // Reload recipes when filters or page change
  const loadRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await recipeService.getFeed({ category, dietType, search, page, pageSize: PAGE_SIZE });
      setRecipes(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message || 'Failed to load recipes.');
    } finally {
      setLoading(false);
    }
  }, [category, dietType, search, page]);

  useEffect(() => { loadRecipes(); }, [loadRecipes]);

  // Reset to page 1 when filters change
  function handleCategoryChange(v)  { setCategory(v); setPage(1); }
  function handleDietTypeChange(v)  { setDietType(v); setPage(1); }
  function handleSearchChange(v)    { setSearch(v);   setPage(1); }

  return (
    <div className="min-h-screen bg-surface">
      <div className="px-4 md:px-6 py-5 max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-bold text-dark">Nutrition</h1>
          <p className="text-sm text-dark/45 mt-0.5">Recipes personalized to your allergies & diet goals</p>
        </div>

        {/* Personalization banner */}
        <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
          <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
          <p className="text-xs text-emerald-700 font-medium">
            Recipes are automatically filtered based on your allergy profile and diet type.
          </p>
        </div>

        {/* Filters */}
        <RecipeFilterBar
          categories={categories}
          category={category}    onCategoryChange={handleCategoryChange}
          dietType={dietType}    onDietTypeChange={handleDietTypeChange}
          search={search}        onSearchChange={handleSearchChange}
        />

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Result count */}
        {!loading && !error && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-dark">
              {category !== 'All' ? category : 'All Recipes'}
            </span>
            <span className="text-xs text-dark/40">{totalCount} results</span>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : recipes.length > 0 ? (
          <motion.div
            key={`${category}-${dietType}-${search}-${page}`}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4"
          >
            {recipes.map(recipe => (
              <motion.div key={recipe.id} variants={cardItem}>
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          !error && (
            <div className="flex flex-col items-center justify-center py-24 text-dark/30 gap-2">
              <span className="text-5xl">🥗</span>
              <p className="text-sm font-medium">No recipes match your current filters</p>
              <button
                onClick={() => { handleCategoryChange('All'); handleDietTypeChange('All'); handleSearchChange(''); }}
                className="mt-1 text-xs text-sky font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          )
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl
                         bg-gray-100 text-gray-500
                         hover:bg-gray-200 hover:text-gray-800
                         disabled:opacity-35 disabled:cursor-not-allowed
                         transition-all duration-150"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .reduce((acc, n, idx, arr) => {
                  if (idx > 0 && n - arr[idx - 1] > 1) acc.push('…');
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, i) =>
                  n === '…' ? (
                    <span key={`e${i}`}
                          className="w-9 h-9 flex items-center justify-center
                                     text-gray-400 text-sm select-none">
                      …
                    </span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl
                                  text-xs font-semibold transition-all duration-150
                                  ${page === n
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800'}`}
                    >
                      {n}
                    </button>
                  )
                )}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl
                         bg-gray-100 text-gray-500
                         hover:bg-gray-200 hover:text-gray-800
                         disabled:opacity-35 disabled:cursor-not-allowed
                         transition-all duration-150"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
