import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Check, Ban, ArrowRight, Wheat, Fish, Leaf, Droplets, Egg, TreePine, Waves } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Peanut SVG — Lucide doesn't have a peanut icon
const PeanutIcon = ({ size = 24, strokeWidth = 1.5, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3C9.5 3 7.5 5 7.5 7.5c0 1.2.45 2.3 1.18 3.1C7.06 11.5 6 13.1 6 15c0 3.3 2.7 6 6 6s6-2.7 6-6c0-1.9-1.06-3.5-2.68-4.4A4.5 4.5 0 0 0 16.5 7.5C16.5 5 14.5 3 12 3z" />
    <line x1="12" y1="10.5" x2="12" y2="13.5" />
  </svg>
)

// Shellfish SVG — shrimp/prawn outline
const ShellfishIcon = ({ size = 24, strokeWidth = 1.5, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3c-1.5 0-3 1.5-3 4 0 1.2.4 2.2 1 3H8a3 3 0 0 0-3 3c0 2 1.5 3 3 3h1c0 1.5 1 3 3 3s3-1.5 3-3V9c0-3.3-1.3-6-3-6z" />
    <path d="M15 10c1.5 0 3 1 3 2.5S16.5 15 15 15" />
    <path d="M10 7H8" />
  </svg>
)

const ALLERGIES = [
  {
    id: 1,
    name: 'Peanuts',
    Icon: PeanutIcon,
    iconBg: 'bg-rose-50',
    selectedIconBg: 'bg-rose-100',
    iconColor: 'text-rose-500',
  },
  {
    id: 2,
    name: 'Milk',
    Icon: Droplets,
    iconBg: 'bg-sky-50',
    selectedIconBg: 'bg-sky-100',
    iconColor: 'text-sky-400',
  },
  {
    id: 3,
    name: 'Eggs',
    Icon: Egg,
    iconBg: 'bg-blue-50',
    selectedIconBg: 'bg-blue-100',
    iconColor: 'text-blue-400',
  },
  {
    id: 4,
    name: 'Gluten',
    Icon: Wheat,
    iconBg: 'bg-amber-50',
    selectedIconBg: 'bg-amber-100',
    iconColor: 'text-amber-500',
  },
  {
    id: 5,
    name: 'Seafood',
    Icon: Fish,
    iconBg: 'bg-cyan-50',
    selectedIconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-500',
  },
  {
    id: 6,
    name: 'Soy',
    Icon: Leaf,
    iconBg: 'bg-green-50',
    selectedIconBg: 'bg-green-100',
    iconColor: 'text-green-500',
  },
  {
    id: 7,
    name: 'Tree Nuts',
    Icon: TreePine,
    iconBg: 'bg-emerald-50',
    selectedIconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    id: 8,
    name: 'Shellfish',
    Icon: ShellfishIcon,
    iconBg: 'bg-slate-50',
    selectedIconBg: 'bg-slate-100',
    iconColor: 'text-slate-400',
  },
]

export default function AllergiesPage() {
  const [selected, setSelected] = useState(new Set())
  const [noneApply, setNoneApply] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = ALLERGIES.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggleAllergy = (id) => {
    setNoneApply(false)
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleNone = () => {
    setNoneApply((prev) => !prev)
    setSelected(new Set())
  }

  const handleContinue = () => {
    const selections = noneApply ? [] : Array.from(selected)
    localStorage.setItem('elitefit_onboarding_allergies', JSON.stringify(selections))
    navigate('/onboarding/goals')
  }

  const canContinue = selected.size > 0 || noneApply

  return (
    <div className="min-h-screen bg-white">
      {/* Spacer for fixed navbar */}
      <div className="pt-16" />

      <div className="max-w-2xl mx-auto px-4 pt-8 pb-32">

        {/* ── Progress card ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-black/[0.07] rounded-2xl px-6 py-4 shadow-sm mb-10"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-dark/35 tracking-widest uppercase font-sans">
              Step 1 of 4
            </span>
            <span className="text-xs font-bold text-brand-accent tracking-widest uppercase font-sans">
              Personalization
            </span>
          </div>
          <div className="h-1 bg-black/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '25%' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="h-full bg-brand-accent rounded-full"
            />
          </div>
        </motion.div>

        {/* ── Title & subtitle ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-[2.1rem] font-heading font-bold text-dark leading-tight mb-3">
            Any allergies we should know about?
          </h1>
          <p className="text-dark/45 text-[0.95rem] md:text-base max-w-sm mx-auto leading-relaxed font-sans">
            This helps us personalize your meal plans and ensure every recipe is
            safe and tailored to your elite performance goals.
          </p>
        </motion.div>

        {/* ── Search ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="relative mb-7"
        >
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/25 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search allergies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3.5 rounded-full border border-black/10 bg-white
                       text-dark text-sm placeholder-dark/30 font-sans
                       focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/40
                       transition-all duration-200"
          />
        </motion.div>

        {/* ── Allergy grid ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((allergy, i) => {
              const isSelected = selected.has(allergy.id)
              return (
                <motion.button
                  key={allergy.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.18, delay: i * 0.04 }}
                  onClick={() => toggleAllergy(allergy.id)}
                  className={`
                    relative flex flex-col items-center gap-3 py-5 px-3 rounded-2xl
                    border-2 bg-white transition-all duration-200 cursor-pointer
                    ${
                      isSelected
                        ? 'border-brand-accent shadow-[0_4px_16px_rgba(240,98,146,0.15)]'
                        : 'border-black/[0.08] hover:border-black/20 shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                    }
                  `}
                >
                  {/* Checkmark badge */}
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

                  {/* Icon container */}
                  <div
                    className={`
                      w-[62px] h-[62px] rounded-[16px] flex items-center justify-center
                      transition-colors duration-200
                      ${isSelected ? allergy.selectedIconBg : allergy.iconBg}
                    `}
                  >
                    <allergy.Icon
                      size={28}
                      strokeWidth={1.5}
                      className={allergy.iconColor}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[13px] font-semibold font-sans transition-colors duration-200 ${
                      isSelected ? 'text-dark' : 'text-dark/65'
                    }`}
                  >
                    {allergy.name}
                  </span>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {/* ── None of these apply ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="flex justify-center"
        >
          <button
            onClick={toggleNone}
            className={`
              inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full
              border-2 font-sans font-medium text-sm transition-all duration-200
              ${
                noneApply
                  ? 'border-brand-accent text-brand-accent bg-brand-accent/5'
                  : 'border-black/12 text-dark/50 hover:border-black/25 hover:text-dark/80'
              }
            `}
          >
            <Ban size={15} strokeWidth={1.75} />
            None of these apply
          </button>
        </motion.div>
      </div>

      {/* ── Sticky footer ── */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t border-black/[0.06] z-40">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/users')}
            className="text-sm font-medium text-dark/40 hover:text-dark/70 font-sans transition-colors px-2 py-1.5"
          >
            Skip
          </button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleContinue}
            className={`
              inline-flex items-center gap-2 px-7 py-3 rounded-full font-sans font-bold text-sm
              transition-all duration-200
              ${
                canContinue
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
