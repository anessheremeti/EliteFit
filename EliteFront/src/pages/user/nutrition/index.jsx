import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RecipeCard } from './components/RecipeCard';
import { RecipeFilterBar } from './components/RecipeFilterBar';
import RecipeCardSkeleton from './components/RecipeCardSkeleton';
import { getRecipes } from '../../../api/user/nutrition/nutritions';

const PAGE_SIZE = 12;

export default function RecipeFeedPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Shteti për kërkimin dhe faqen aktuale
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Thirrja e API-së për listën e recetave
  useEffect(() => {
    const fetchRecipesData = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = {
          search: search !== '' ? search : undefined,
        };

        const data = await getRecipes(queryParams);
        
        // Menaxhimi i interceptorit: nëse kthehet direkt array ose objekt me .data
        const actualData = data?.data || data;
        setRecipes(Array.isArray(actualData) ? actualData : []);
      } catch (err) {
        setError('Ndodhi një gabim gjatë ngarkimit të recetave. Ju lutem provoni përsëri.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipesData();
  }, [search]); // Ri-thirret kur ndryshon kërkimi

  // RREGULLIMI KRYESOR: Filtrimi lokal në bazë të emrit (Title / title)
  const filteredRecipes = recipes.filter(recipe => {
    if (!search) return true;
    
    // Kontrollon të dyja variantet pasi C# vjen me 'Title' por nganjëherë interceptori e kthen 'title'
    const recipeName = recipe.title || recipe.Title || recipe.instructions || recipe.Instructions || '';
    return recipeName.toLowerCase().includes(search.toLowerCase());
  });

  // Logjika e ndarjes në faqe (Pagination) bazuar mbi recetat e filtruara tashmë
  const totalPages = Math.ceil(filteredRecipes.length / PAGE_SIZE) || 1;
  const paginatedRecipes = filteredRecipes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-surface">
      <div className="px-4 md:px-6 py-5 max-w-7xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-2xl font-heading font-bold text-dark">Nutrition</h1>
          <p className="text-sm text-dark/45 mt-0.5">Explore our delicious recipes</p>
        </div>

        {/* Shiriti i kërkimit */}
        <RecipeFilterBar
          search={search} 
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
        />

        <div className="flex items-baseline gap-2">
          <span className="text-xs text-dark/40">
            {loading ? 'Duke u ngarkuar...' : `${filteredRecipes.length} rezultate`}
          </span>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100">
            <p>{error}</p>
          </div>
        )}

        {/* Grid-i i Kartelave */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <RecipeCardSkeleton key={index} />
            ))
          ) : (
            paginatedRecipes.map(recipe => (
              <RecipeCard key={recipe.id || recipe.Id} recipe={recipe} />
            ))
          )}
        </div>

        {/* Kur nuk gjendet asgjë pas filtrimit */}
        {!loading && filteredRecipes.length === 0 && !error && (
          <div className="py-24 text-center text-dark/30">
            <p>Nuk u gjet asnjë recetë me emrin "{search}".</p>
          </div>
        )}

        {/* Navigimi i faqeve */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1} 
              className="p-2 bg-gray-100 rounded-xl disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm">{page} / {totalPages}</span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
              disabled={page === totalPages} 
              className="p-2 bg-gray-100 rounded-xl disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}