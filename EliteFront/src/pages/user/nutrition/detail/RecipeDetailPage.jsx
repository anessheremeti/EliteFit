import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Flame, ShieldAlert, Loader2, FileText } from 'lucide-react';
import axiosClient from '../../../api/axiosClient';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        // Thirrja e API-së në backend sipas ID-së specifike
        const response = await axiosClient.get(`/api/recipes/${id}`);
        
        // Përshtatja nëse backend-i i kthen të dhënat direkt ose brenda një objekti 'data'
        const data = response.data?.data || response.data;
        setRecipe(data);
      } catch (err) {
        console.error("Gabim gjatë marrjes së detajeve të recetës:", err);
        setError("Nuk u mundësua ngarkimi i recetës. Mund të mos ekzistojë ose ka një problem me serverin.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipeDetail();
    }
  }, [id]);

  // Shteti i ngarkimit (Loading State)
  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3 text-dark/60">
        <Loader2 className="animate-spin text-sky" size={32} />
        <p className="text-sm font-medium">Po ngarkohen detajet e recetës...</p>
      </div>
    );
  }

  // Shteti i gabimit ose nëse receta nuk ekziston
  if (error || !recipe) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center max-w-md mx-auto space-y-4">
        <div className="p-3 bg-rose-50 text-rose-500 rounded-full">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-xl font-bold text-dark">Receta nuk u gjet</h2>
        <p className="text-sm text-dark/60">{error || "Kjo recetë nuk ekziston ose është fshirë."}</p>
        <button 
          onClick={() => navigate('/user/nutrition')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-dark font-semibold rounded-xl text-sm transition-colors"
        >
          Kthehu te Recetat
        </button>
      </div>
    );
  }

  // Mapimi i saktë i fushave që vijnë nga SQL Server-i yt
  const title = recipe.title || recipe.Title || 'Pa titull';
  const instructions = recipe.instructions || recipe.Instructions;
  const calories = recipe.calories ?? recipe.Calories ?? 0;
  const protein = recipe.proteinG ?? recipe.ProteinG ?? recipe.protein_g ?? 0;
  const carbs = recipe.carbsG ?? recipe.CarbsG ?? recipe.carbs_g ?? 0;
  const fat = recipe.fatG ?? recipe.FatG ?? recipe.fat_g ?? 0;

  return (
    <div className="min-h-screen bg-surface pb-12">
      <div className="max-w-3xl mx-auto px-4 pt-4 space-y-6">
        
        {/* Butoni Kthehu mbrapa */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-sm font-semibold text-dark/60 hover:text-dark transition-colors group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          Kthehu mbrapa
        </button>

        {/* Kartela Kryesore e Detajeve */}
        <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
          
          {/* Zona e Fotos / Placeholdesit */}
          <div className="relative h-64 sm:h-80 bg-gray-100 flex items-center justify-center">
            {recipe.imageUrl || recipe.ImageUrl ? (
              <img 
                src={recipe.imageUrl || recipe.ImageUrl} 
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl text-gray-300">🍽️</span>
            )}
          </div>

          {/* Përmbajtja e Tekstit */}
          <div className="p-5 sm:p-8 space-y-6">
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-dark leading-tight">
                {title}
              </h1>
            </div>

            {/* Rreshti i Kalorive (I thjeshtuar vetëm me ato që ke në DB) */}
            <div className="flex items-center justify-center py-4 border-y border-gray-100 text-center">
              <div className="flex flex-col items-center gap-1">
                <Flame size={24} className="text-orange-500" />
                <span className="text-xs text-dark/40 font-medium">Vlera Energjetike</span>
                <span className="text-base font-bold text-dark">{calories} kcal</span>
              </div>
            </div>

            {/* Makronutrientët (Nga databaza jote - mbrohen nga vlerat NULL) */}
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

            {/* Udhëzimet / Instructions (Fushat e SQL Server-it tënd) */}
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