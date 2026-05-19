import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingDown, Dumbbell, Zap, Wind, Apple, Heart, Trophy, ShieldCheck, Check, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const GOALS = [
  {
    id: 1,
    name: 'Lose Weight',
    description: 'Burn fat, look leaner',
    Icon: TrendingDown,
    iconBg: 'bg-rose-50',
    selectedIconBg: 'bg-rose-100',
    iconColor: 'text-rose-500',
  },
  {
    id: 2,
    name: 'Build Muscle',
    description: 'Gain strength & mass',
    Icon: Dumbbell,
    iconBg: 'bg-violet-50',
    selectedIconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    id: 3,
    name: 'More Energy',
    description: 'Feel alive every day',
    Icon: Zap,
    iconBg: 'bg-amber-50',
    selectedIconBg: 'bg-amber-100',
    iconColor: 'text-amber-500',
  },
  {
    id: 4,
    name: 'Flexibility',
    description: 'Move freely & painlessly',
    Icon: Wind,
    iconBg: 'bg-teal-50',
    selectedIconBg: 'bg-teal-100',
    iconColor: 'text-teal-500',
  },
  {
    id: 5,
    name: 'Eat Better',
    description: 'Fuel your body right',
    Icon: Apple,
    iconBg: 'bg-green-50',
    selectedIconBg: 'bg-green-100',
    iconColor: 'text-green-500',
  },
  {
    id: 6,
    name: 'Less Stress',
    description: 'Find balance & calm',
    Icon: Heart,
    iconBg: 'bg-pink-50',
    selectedIconBg: 'bg-pink-100',
    iconColor: 'text-pink-500',
  },
  {
    id: 7,
    name: 'Performance',
    description: 'Train like an athlete',
    Icon: Trophy,
    iconBg: 'bg-orange-50',
    selectedIconBg: 'bg-orange-100',
    iconColor: 'text-orange-500',
  },
  {
    id: 8,
    name: 'Better Health',
    description: 'Live longer, live well',
    Icon: ShieldCheck,
    iconBg: 'bg-sky-50',
    selectedIconBg: 'bg-sky-100',
    iconColor: 'text-sky-500',
  },
]

export default function GoalsPage() {
  const [selected, setSelected] = useState(new Set())
  const navigate = useNavigate()

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleContinue = () => {
    localStorage.setItem('elitefit_onboarding_goals', JSON.stringify(Array.from(selected)))
    navigate('/onboarding/profile')
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
          <h1 className="text-3xl md:text-[2.1rem] font-heading font-bold text-dark leading-tight mb-3">
            What are your fitness goals?
          </h1>
          <p className="text-dark/45 text-[0.95rem] max-w-sm mx-auto leading-relaxed font-sans">
            Select all that apply. We'll build your personalised plan around what
            matters most to you.
          </p>
        </motion.div>

        {/* Goals grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {GOALS.map((goal, i) => {
            const isSelected = selected.has(goal.id)
            return (
              <motion.button
                key={goal.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.18, delay: i * 0.04 }}
                onClick={() => toggle(goal.id)}
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
                    ${isSelected ? goal.selectedIconBg : goal.iconBg}
                  `}
                >
                  <goal.Icon size={26} strokeWidth={1.5} className={goal.iconColor} />
                </div>

                <div>
                  <p className={`text-[13px] font-semibold font-sans ${isSelected ? 'text-dark' : 'text-dark/70'}`}>
                    {goal.name}
                  </p>
                  <p className="text-[11px] text-dark/35 font-sans mt-0.5 leading-tight">
                    {goal.description}
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
                selected.size > 0
                  ? 'bg-brand-dark text-white shadow-lg shadow-black/15 hover:bg-brand-dark/90'
                  : 'bg-brand-dark/70 text-white/80 cursor-not-allowed'
              }
            `}
          >
            Continue
            <ArrowRight size={15} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
