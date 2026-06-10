import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingDown, Dumbbell, Zap, Wind, Apple, Heart, Trophy, ShieldCheck, Loader2, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserGoals, getAllGoals } from '../../../api/user/gamification/goals';

// Mapimi i ikonave dhe ngjyrave për konsistencë vizuale
const ICON_MAP = {
  'Lose Weight': { Icon: TrendingDown, bg: 'bg-rose-50', color: 'text-rose-500', desc: 'Burn fat, look leaner' },
  'Build Muscle': { Icon: Dumbbell, bg: 'bg-violet-50', color: 'text-violet-600', desc: 'Gain strength & mass' },
  'More Energy': { Icon: Zap, bg: 'bg-amber-50', color: 'text-amber-500', desc: 'Feel alive every day' },
  'Flexibility': { Icon: Wind, bg: 'bg-teal-50', color: 'text-teal-500', desc: 'Move freely & painlessly' },
  'Eat Better': { Icon: Apple, bg: 'bg-green-50', color: 'text-green-500', desc: 'Fuel your body right' },
  'Less Stress': { Icon: Heart, bg: 'bg-pink-50', color: 'text-pink-500', desc: 'Find balance & calm' },
  'Performance': { Icon: Trophy, bg: 'bg-orange-50', color: 'text-orange-500', desc: 'Train like an athlete' },
  'Better Health': { Icon: ShieldCheck, bg: 'bg-sky-50', color: 'text-sky-500', desc: 'Live longer, live well' },
};

// Funksion ndihmës për të formatuar përgjigjet nga .NET / backend
const extractData = (res) => res?.data || res?.$values || (Array.isArray(res) ? res : []);

export default function UserGoalsDisplay() {
  const [myGoals, setMyGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserGoals = async () => {
      try {
        const userId = localStorage.getItem('elitefit_user_id') || 1;

        // 1. PËRPOQJE NGA BACKEND: Provo të marrësh qëllimet e userit
        try {
          const response = await getUserGoals(userId);
          const goals = extractData(response);
          
          if (goals.length > 0) {
            setMyGoals(goals);
            setLoading(false);
            return; // Ndalo ekzekutimin këtu nëse i gjejmë me sukses
          }
        } catch (apiErr) {
          console.warn("Backend API nuk u gjet, po kalohet tek fallback...");
        }

        // 2. FALLBACK LOKAL: Përdor localStorage nëse backend dështon ose është bosh
        const savedGoalIds = JSON.parse(localStorage.getItem('elitefit_onboarding_goals') || '[]');
        
        if (savedGoalIds.length > 0) {
          const allGoalsResponse = await getAllGoals();
          const allGoalsList = extractData(allGoalsResponse);
          
          // Filtro qëllimet që ekzistojnë në localStorage
          const filteredGoals = allGoalsList.filter(g => savedGoalIds.includes(g.id ?? g.Id));
          setMyGoals(filteredGoals);
        }
        
      } catch (err) {
        console.error("Gabim gjatë ngarkimit të qëllimeve të përdoruesit:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGoals();
  }, []);

  // Gjendja e Ngarkimit (Loading State)
  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center bg-white rounded-3xl">
        <Loader2 className="animate-spin text-sky-500" size={36} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            My Fitness Goals
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Your personalized program is tailored to these objectives.
          </p>
        </div>

      {/*
<button
  onClick={() => navigate('/onboarding/goals')}
  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 
             text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 
             transition-all duration-200 shadow-sm"
>
  <Edit2 size={16} className="text-gray-400" />
  Update Goals
</button>
*/}
      </div>

      {/* --- KARTA E BOSH (Empty State) --- */}
      {myGoals.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
            <Trophy className="text-gray-300" size={28} />
          </div>
          <p className="text-gray-500 text-base font-medium">No goals selected yet.</p>
          <p className="text-gray-400 text-sm mt-1">Click 'Update Goals' to set your path.</p>
        </motion.div>
      ) : (
        
        /* --- LISTA E QËLLIMEVE (Grid) --- */
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {myGoals.map((goal) => {
            const currentId = goal.id ?? goal.Id;
            const currentName = goal.name ?? goal.Name;

            // Merr konfigurimin e ikonës, ose vendos një default nëse nuk gjendet
            const uiConfig = ICON_MAP[currentName] || {
              Icon: ShieldCheck, bg: 'bg-gray-50', color: 'text-gray-500', desc: 'Custom Fitness Goal'
            };
            const { Icon, bg, color, desc } = uiConfig;

            return (
              <motion.div
                key={currentId}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="group flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white 
                           shadow-sm hover:shadow-md hover:border-sky-100 transition-all duration-300"
              >
                {/* Ikona */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${bg} group-hover:scale-105 transition-transform`}>
                  <Icon size={24} strokeWidth={2} className={color} />
                </div>

                {/* Teksti */}
                <div className="flex-1 overflow-hidden">
                  <h3 className="text-base font-bold text-gray-900 truncate">
                    {currentName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2">
                    {desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}