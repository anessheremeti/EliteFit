import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Monitor, Timer, Bike, Dumbbell, Flame, UtensilsCrossed, Leaf, TreePine, Globe, Check, ArrowRight, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ACTIVITY_LEVELS = [
  {
    id: 1,
    name: 'Sedentary',
    description: 'Mostly desk work, little movement',
    Icon: Monitor,
    iconBg: 'bg-slate-50',
    selectedIconBg: 'bg-slate-100',
    iconColor: 'text-slate-400',
  },
  {
    id: 2,
    name: 'Lightly Active',
    description: '1–2 light workouts per week',
    Icon: Timer,
    iconBg: 'bg-blue-50',
    selectedIconBg: 'bg-blue-100',
    iconColor: 'text-blue-400',
  },
  {
    id: 3,
    name: 'Moderately Active',
    description: '3–4 workouts per week',
    Icon: Bike,
    iconBg: 'bg-sky-50',
    selectedIconBg: 'bg-sky-100',
    iconColor: 'text-sky-500',
  },
  {
    id: 4,
    name: 'Very Active',
    description: '5–6 intense workouts per week',
    Icon: Dumbbell,
    iconBg: 'bg-violet-50',
    selectedIconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    id: 5,
    name: 'Athlete',
    description: 'Daily or twice-daily training',
    Icon: Flame,
    iconBg: 'bg-rose-50',
    selectedIconBg: 'bg-rose-100',
    iconColor: 'text-rose-500',
  },
]

const DIET_TYPES = [
  { id: 'omnivore',      label: 'Omnivore',      Icon: UtensilsCrossed },
  { id: 'vegetarian',    label: 'Vegetarian',    Icon: Leaf },
  { id: 'vegan',         label: 'Vegan',         Icon: TreePine },
  { id: 'keto',          label: 'Keto',          Icon: Flame },
  { id: 'mediterranean', label: 'Mediterranean', Icon: Globe },
  { id: 'other',         label: 'Other',         Icon: CheckCircle2 },
]

export default function ActivityPage() {
  const [activityLevel, setActivityLevel] = useState(null)
  const [dietType, setDietType] = useState('')
  const navigate = useNavigate()

  const handleContinue = () => {
    const profile = JSON.parse(localStorage.getItem('elitefit_onboarding_profile') || '{}')
    localStorage.setItem(
      'elitefit_onboarding_profile',
      JSON.stringify({ ...profile, workoutsPerWeek: activityLevel, dietType })
    )
    localStorage.setItem('elitefit_onboarding_complete', 'true')
    navigate('/users')
  }

  const canContinue = activityLevel !== null && dietType !== ''

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
              Step 4 of 4
            </span>
            <span className="text-xs font-bold text-brand-accent tracking-widest uppercase font-sans">
              Personalization
            </span>
          </div>
          <div className="h-1 bg-black/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '75%' }}
              animate={{ width: '100%' }}
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
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-[2.1rem] font-heading font-bold text-dark leading-tight mb-3">
            How active are you?
          </h1>
          <p className="text-dark/45 text-[0.95rem] max-w-sm mx-auto leading-relaxed font-sans">
            Be honest — this shapes your calorie targets and workout intensity.
          </p>
        </motion.div>

        {/* ── Activity levels ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col gap-3 mb-10"
        >
          {ACTIVITY_LEVELS.map((level, i) => {
            const isSelected = activityLevel === level.id
            return (
              <motion.button
                key={level.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.06 }}
                onClick={() => setActivityLevel(level.id)}
                className={`
                  flex items-center gap-4 p-4 rounded-2xl border-2 bg-white
                  transition-all duration-200 text-left
                  ${
                    isSelected
                      ? 'border-brand-accent shadow-[0_4px_16px_rgba(240,98,146,0.12)]'
                      : 'border-black/[0.08] hover:border-black/20 shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
                  }
                `}
              >
                <div
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                    transition-colors duration-200
                    ${isSelected ? level.selectedIconBg : level.iconBg}
                  `}
                >
                  <level.Icon size={22} strokeWidth={1.5} className={level.iconColor} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold font-sans ${isSelected ? 'text-dark' : 'text-dark/70'}`}>
                    {level.name}
                  </p>
                  <p className="text-xs text-dark/35 font-sans mt-0.5">{level.description}</p>
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="w-6 h-6 rounded-full bg-brand-accent flex items-center justify-center shrink-0"
                    >
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </motion.div>

        {/* ── Diet type ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
        >
          <h2 className="text-base font-heading font-bold text-dark mb-4">
            What's your diet style?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DIET_TYPES.map((diet, i) => {
              const isSelected = dietType === diet.id
              return (
                <motion.button
                  key={diet.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.18, delay: 0.45 + i * 0.05 }}
                  onClick={() => setDietType(diet.id)}
                  className={`
                    relative flex items-center gap-3 p-3.5 rounded-2xl border-2 bg-white
                    transition-all duration-200 text-left
                    ${
                      isSelected
                        ? 'border-brand-accent shadow-[0_4px_12px_rgba(240,98,146,0.12)]'
                        : 'border-black/[0.08] hover:border-black/20 shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
                    }
                  `}
                >
                  <div
                    className={`
                      w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                      transition-colors duration-200
                      ${isSelected ? 'bg-brand-accent/10' : 'bg-black/[0.04]'}
                    `}
                  >
                    <diet.Icon
                      size={18}
                      strokeWidth={1.5}
                      className={isSelected ? 'text-brand-accent' : 'text-dark/40'}
                    />
                  </div>
                  <span className={`text-sm font-semibold font-sans ${isSelected ? 'text-dark' : 'text-dark/60'}`}>
                    {diet.label}
                  </span>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.4 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-accent flex items-center justify-center"
                      >
                        <Check size={8} className="text-white" strokeWidth={3.5} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t border-black/[0.06] z-40">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/onboarding/profile')}
            className="text-sm font-medium text-dark/40 hover:text-dark/70 font-sans transition-colors px-2 py-1.5"
          >
            Back
          </button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleContinue}
            className={`
              inline-flex items-center gap-2 px-7 py-3 rounded-full font-sans font-bold text-sm
              transition-all duration-200
              ${
                canContinue
                  ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/25 hover:opacity-90'
                  : 'bg-brand-dark/70 text-white/80 cursor-not-allowed'
              }
            `}
          >
            {canContinue ? "Let's Go!" : 'Continue'}
            <ArrowRight size={15} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
