import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Flame, ShieldAlert, Loader2, FileText } from 'lucide-react';
import { getRecipeDetails } from '../../../../api/user/nutrition/nutritions'; 

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_BASE_URL = 'https://localhost:7049';

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const responseData = await getRecipeDetails(id); 
        
        console.log("1. Çfarë kthen API direkt:", responseData);

        let recipeData = null;
        let recordsList = null;

        // Identifikojmë nëse përgjigja vjen si listë (Array)
        if (responseData && Array.isArray(responseData)) {
          recordsList = responseData;
        } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
          recordsList = responseData.data;
        }

        // RREGULLIMI: Nëse është listë, gjejmë vetëm recetën që përputhet me ID-në e URL-së
        if (recordsList) {
          recipeData = recordsList.find(r => String(r.id || r.Id) === String(id));
        } else if (responseData && responseData.data) {
          recipeData = responseData.data;
        } else {
          recipeData = responseData;
        }
        
        console.log("2. Objekti i saktësuar i recetës:", recipeData);
        
        if (!recipeData) {
          setError("Receta specifike nuk u gjet në sistem.");
        } else {
          setRecipe(recipeData);
        }
      } catch (err) {
        console.error("Gabim gjatë marrjes së detajeve:", err);
        setError("Nuk u mundësua ngarkimi i recetës.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipeDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3 text-dark/60">
        <Loader2 className="animate-spin text-sky" size={32} />
        <p className="text-sm font-medium">Po ngarkohen detajet e recetës...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center max-w-md mx-auto space-y-4">
        <div className="p-3 bg-rose-50 text-rose-500 rounded-full">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-xl font-bold text-dark">Receta nuk u gjet</h2>
        <p className="text-sm text-dark/60">{error || "Kjo recetë nuk ekziston ose është fshirë."}</p>
        <button 
          onClick={() => navigate('/users/nutrition')} // RREGULLIMI: U bë 'users' që të përputhet me rrugën tuaj
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-dark font-semibold rounded-xl text-sm transition-colors"
        >
          Kthehu te Recetat
        </button>
      </div>
    );
  }

  // Mapimi i fushave nga SQL Server
  const title = recipe.Title || recipe.title || 'Pa titull';
  const instructions = recipe.Instructions || recipe.instructions;
  const calories = recipe.Calories ?? recipe.calories ?? 0;
  const protein = recipe.ProteinG ?? recipe.proteinG ?? recipe.protein_g ?? 0;
  const carbs = recipe.CarbsG ?? recipe.carbsG ?? recipe.carbs_g ?? 0;
  const fat = recipe.FatG ?? recipe.fatG ?? recipe.fat_g ?? 0;

  // RREGULLIMI I FOTOS: Parandalon double-slash nëse rruga fillon me '/'
  const rawImageUrl = recipe.ImageUrl || recipe.imageUrl || recipe.Image || recipe.image;
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
    <div className="min-h-screen bg-surface pb-12">
      <div className="max-w-3xl mx-auto px-4 pt-4 space-y-6">
        
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-sm font-semibold text-dark/60 hover:text-dark transition-colors group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          Kthehu mbrapa
        </button>

        <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
          
          {/* Zona e Fotos */}
          <div className="relative h-64 sm:h-80 bg-gray-100 flex items-center justify-center">
            {finalImageUrl ? (
              <img 
                src={finalImageUrl} 
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Imazhi dështoi të ngarkohej:", finalImageUrl);
                  e.target.style.display = 'none';
                  if(e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            
            <div 
              style={{ display: finalImageUrl ? 'none' : 'flex' }} 
              className="w-full h-full flex items-center justify-center text-6xl text-gray-300 bg-gray-100"
            >
              🍽️
            </div>
          </div>

          <div className="p-5 sm:p-8 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-dark leading-tight">
                {title}
              </h1>
            </div>

            <div className="flex items-center justify-center py-4 border-y border-gray-100 text-center">
              <div className="flex flex-col items-center gap-1">
                <Flame size={24} className="text-orange-500" />
                <span className="text-xs text-dark/40 font-medium">Vlera Energjetike</span>
                <span className="text-base font-bold text-dark">{calories} kcal</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <h3 className="font-heading font-bold text-sm text-dark">Makronutrientët për porcion:</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-sky/5 border border-sky/10 rounded-2xl p-3 text-center">
                  <span className="block text-xs font-bold text-sky mb-0.5">Proteina</span>
                  <span className="text-base font-black text-dark">{protein}g</span>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-3 text-center">
                  <span className="block text-xs font-bold text-amber-600 mb-0.5">Karbohidrate</span>
                  <span className="text-base font-black text-dark">{carbs}g</span>
                </div>
                <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-3 text-center">
                  <span className="block text-xs font-bold text-rose-500 mb-0.5">Yndyrna</span>
                  <span className="text-base font-black text-dark">{fat}g</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-dark/60" />
                <h3 className="font-heading font-bold text-base text-dark">Udhëzimet e Përgatitjes:</h3>
              </div>
              
              {instructions ? (
                <div className="bg-gray-50/50 rounded-2xl p-4 border border-black/[0.03]">
                  <p className="text-sm text-dark/70 leading-relaxed whitespace-pre-line font-sans">
                    {instructions}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-dark/30 italic pl-1">Nuk ka udhëzime të shkruara për këtë recetë.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}