import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingDown, Dumbbell, Zap, Wind, Apple, Heart, Trophy, ShieldCheck, Check, ArrowRight, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
// Importojmë funksionet e API-së nga rruga e saktë sipas strukturës tënde të folderave
import { getAllGoals, assignUserGoals } from '../../../api/user/gamification/goals'

// Mapimi i ikonave dhe ngjyrave bazuar në emrin ekzakt që vjen nga SQL Server / .NET
const ICON_MAP = {
  'Lose Weight': { Icon: TrendingDown, bg: 'bg-rose-50', selBg: 'bg-rose-100', color: 'text-rose-500', desc: 'Burn fat, look leaner' },
  'Build Muscle': { Icon: Dumbbell, bg: 'bg-violet-50', selBg: 'bg-violet-100', color: 'text-violet-600', desc: 'Gain strength & mass' },
  'More Energy': { Icon: Zap, bg: 'bg-amber-50', selBg: 'bg-amber-100', color: 'text-amber-500', desc: 'Feel alive every day' },
  'Flexibility': { Icon: Wind, bg: 'bg-teal-50', selBg: 'bg-teal-100', color: 'text-teal-500', desc: 'Move freely & painlessly' },
  'Eat Better': { Icon: Apple, bg: 'bg-green-50', selBg: 'bg-green-100', color: 'text-green-500', desc: 'Fuel your body right' },
  'Less Stress': { Icon: Heart, bg: 'bg-pink-50', selBg: 'bg-pink-100', color: 'text-pink-500', desc: 'Find balance & calm' },
  'Performance': { Icon: Trophy, bg: 'bg-orange-50', selBg: 'bg-orange-100', color: 'text-orange-500', desc: 'Train like an athlete' },
  'Better Health': { Icon: ShieldCheck, bg: 'bg-sky-50', selBg: 'bg-sky-100', color: 'text-sky-500', desc: 'Live longer, live well' },
}

export default function GoalsPage() {
  const [goals, setGoals] = useState([]) // Ruan qëllimet që vijnë live nga databaza
  const [selected, setSelected] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  // 1. Ngarkimi i qëllimeve nga Backend-i kur hapet faqja
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const responseData = await getAllGoals()
        
        // Mbrojtje e trefashtë në varësi se si .NET i paketon të dhënat (direkt array, .data ose .$values)
        const actualList = responseData?.data || responseData?.$values || (Array.isArray(responseData) ? responseData : [])
        
        setGoals(actualList)
      } catch (err) {
        console.error("Gabim gjatë marrjes së qëllimeve:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchGoals()
  }, [])

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // 2. Dërgimi i të dhënave në Backend kur klikohet Continue
  const handleContinue = async () => {
    if (selected.size === 0) return

    setSubmitting(true)
    try {
      // Merrni ID-në e përdoruesit aktual të loguar (nëse nuk ekziston vendoset 1 si fallback)
      const userId = localStorage.getItem('elitefit_user_id') || 1 
      const goalIdsArray = Array.from(selected)

      // Thirrja e endpoint-it POST "api/Goals/user/assign"
      await assignUserGoals(userId, goalIdsArray)

      // Ruajmë gjithashtu në localStorage për rrjedhën e mëtutjeshme të onboarding
      localStorage.setItem('elitefit_onboarding_goals', JSON.stringify(goalIdsArray))
      
      // Navigojmë te faqja e profilit
      navigate('/onboarding/profile')
    } catch (err) {
      console.error("Dështoi ruajtja e qëllimeve në backend:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-brand-accent" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-16" />

      <div className="max-w-2xl mx-auto px-4 pt-8 pb-32">

        {/* Progress card */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-black/[0.07] rounded-2xl px-6 py-4 shadow-sm mb-10"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-dark/35 tracking-widest uppercase font-sans">
              Step 2 of 4
            </span>
            <span className="text-xs font-bold text-brand-accent tracking-widest uppercase font-sans">
              Personalization
            </span>
          </div>
          <div className="h-1 bg-black/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '25%' }}
              animate={{ width: '50%' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="h-full bg-brand-accent rounded-full"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-[2.1rem] font-heading font-bold text-dark loam-tight mb-3">
            What are your fitness goals?
          </h1>
          <p className="text-dark/45 text-[0.95rem] max-w-sm mx-auto leading-relaxed font-sans">
            Select all that apply. We'll build your personalised plan around what
            matter most to you.
          </p>
        </motion.div>

        {/* Goals grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {goals.map((goal, i) => {
            // Suporton si shkronjat e mëdha ashtu edhe të vogla nga backend-i (id / Id dhe name / Name)
            const currentId = goal.id ?? goal.Id;
            const currentName = goal.name ?? goal.Name;
            
            const isSelected = selected.has(currentId)

            // Gjen konfigurimin e dizajnit sipas emrit të qëllimit nga DB
            const uiConfig = ICON_MAP[currentName] || {
              Icon: ShieldCheck, bg: 'bg-gray-50', selBg: 'bg-gray-100', color: 'text-gray-500', desc: 'Fitness Goal'
            }
            const { Icon, bg, selBg, color, desc } = uiConfig

            return (
              <motion.button
                key={currentId}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.18, delay: i * 0.04 }}
                onClick={() => toggle(currentId)}
                className={`
                  relative flex flex-col items-center gap-2.5 py-5 px-3 rounded-2xl
                  border-2 bg-white transition-all duration-200 cursor-pointer text-center
                  ${
                    isSelected
                      ? 'border-brand-accent shadow-[0_4px_16px_rgba(240,98,146,0.15)]'
                      : 'border-black/[0.08] hover:border-black/20 shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                  }
                `}
              >
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.4 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="absolute top-2.5 right-2.5 w-[18px] h-[18px] rounded-full
                                 bg-brand-accent flex items-center justify-center z-10"
                    >
                      <Check size={10} className="text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div
                  className={`
                    w-[58px] h-[58px] rounded-[14px] flex items-center justify-center
                    transition-colors duration-200
                    ${isSelected ? selBg : bg}
                  `}
                >
                  <Icon size={26} strokeWidth={1.5} className={color} />
                </div>

                <div>
                  <p className={`text-[13px] font-semibold font-sans ${isSelected ? 'text-dark' : 'text-dark/70'}`}>
                    {currentName}
                  </p>
                  <p className="text-[11px] text-dark/35 font-sans mt-0.5 leading-tight">
                    {desc}
                  </p>
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t border-black/[0.06] z-40">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/onboarding')}
            disabled={submitting}
            className="text-sm font-medium text-dark/40 hover:text-dark/70 font-sans transition-colors px-2 py-1.5 disabled:opacity-50"
          >
            Back
          </button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleContinue}
            disabled={selected.size === 0 || submitting}
            className={`
              inline-flex items-center gap-2 px-7 py-3 rounded-full font-sans font-bold text-sm
              transition-all duration-200
              ${
                selected.size > 0 && !submitting
                  ? 'bg-brand-dark text-white shadow-lg shadow-black/15 hover:bg-brand-dark/90'
                  : 'bg-brand-dark/70 text-white/80 cursor-not-allowed'
              }
            `}
          >
            {submitting ? (
              <> Ruajtja... <Loader2 className="animate-spin" size={14} /> </>
            ) : (
              <> Continue <ArrowRight size={15} strokeWidth={2.5} /> </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}