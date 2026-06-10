import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Check, Ban, ArrowRight, Wheat, Fish, Leaf, Droplets, Egg, TreePine, Waves, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllergies, updateUserAllergies } from '../../../api/user/gamification/allergies' // Rregullo shtegun nëse ndryshon

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

// Mapimi i dizajnit statik bazuar në emrin që vjen nga databaza
const getVisualsByName = (name) => {
  const norm = name.toLowerCase().trim();
  if (norm.includes('peanut')) return { Icon: PeanutIcon, bg: 'bg-rose-50', selBg: 'bg-rose-100', color: 'text-rose-500' };
  if (norm.includes('milk') || norm.includes('lakt')) return { Icon: Droplets, bg: 'bg-sky-50', selBg: 'bg-sky-100', color: 'text-sky-400' };
  if (norm.includes('egg')) return { Icon: Egg, bg: 'bg-blue-50', selBg: 'bg-blue-100', color: 'text-blue-400' };
  if (norm.includes('gluten') || norm.includes('wheat')) return { Icon: Wheat, bg: 'bg-amber-50', selBg: 'bg-amber-100', color: 'text-amber-500' };
  if (norm.includes('seafood') || norm.includes('fish')) return { Icon: Fish, bg: 'bg-cyan-50', selBg: 'bg-cyan-100', color: 'text-cyan-500' };
  if (norm.includes('soy')) return { Icon: Leaf, bg: 'bg-green-50', selBg: 'bg-green-100', color: 'text-green-500' };
  if (norm.includes('tree') || norm.includes('nut')) return { Icon: TreePine, bg: 'bg-emerald-50', selBg: 'bg-emerald-100', color: 'text-emerald-600' };
  if (norm.includes('shell')) return { Icon: ShellfishIcon, bg: 'bg-slate-50', selBg: 'bg-slate-100', color: 'text-slate-400' };
  
  // Default nëse nuk përputhet asnjë lartë
  return { Icon: Waves, bg: 'bg-gray-50', selBg: 'bg-gray-100', color: 'text-gray-400' };
}

export default function AllergiesPage() {
  const [allergiesList, setAllergiesList] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [noneApply, setNoneApply] = useState(false)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const navigate = useNavigate()

  // 1. Merr alergjitë nga API kur ngarkohet faqja
  useEffect(() => {
    const fetchAllergiesData = async () => {
      setIsLoading(true)
      const data = await getAllergies()
      setAllergiesList(data)
      setIsLoading(false)
    };
    fetchAllergiesData()
  }, [])

  const filtered = allergiesList.filter((a) =>
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

  // 2. Ruaj përzgjedhjet në Databazë përmes API-së
  const handleContinue = async () => {
    if (!canContinue || isSaving) return

    const selections = noneApply ? [] : Array.from(selected)
    
    // Supozojmë se ID e userit aktual ruhet në localStorage pas login-it, ose vendos përkohësisht një ID (p.sh. 1) për testim
    const currentUserId = localStorage.getItem('elitefit_user_id') ? parseInt(localStorage.getItem('elitefit_user_id')) : 1;

    try {
      setIsSaving(true)
      
      // Thirrja e API-së së re në Backend
      await updateUserAllergies(currentUserId, selections)
      
      // Ruajtja lokale opsionale për hapat e tjerë të onboarding
      localStorage.setItem('elitefit_onboarding_allergies', JSON.stringify(selections))
      
      navigate('/onboarding/goals')
    } catch (error) {
      alert("Ndodhi një gabim gjatë ruajtjes së alergjive. Ju lutem provoni përsëri.")
    } finally {
      setIsSaving(false)
    }
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

        {/* ── Loading State ── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-dark/45">
            <Loader2 className="animate-spin text-brand-accent" size={32} />
            <p className="text-sm font-sans">Loading allergies from server...</p>
          </div>
        ) : (
          /* ── Allergy grid ── */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((allergy, i) => {
                const isSelected = selected.has(allergy.id)
                const visuals = getVisualsByName(allergy.name)
                
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
                        ${isSelected ? visuals.selBg : visuals.bg}
                      `}
                    >
                      <visuals.Icon
                        size={28}
                        strokeWidth={1.5}
                        className={visuals.color}
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
        )}

        {/* ── None of these apply ── */}
        {!isLoading && (
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
        )}
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
            disabled={!canContinue || isSaving}
            onClick={handleContinue}
            className={`
              inline-flex items-center gap-2 px-7 py-3 rounded-full font-sans font-bold text-sm
              transition-all duration-200
              ${
                canContinue && !isSaving
                  ? 'bg-brand-dark text-white shadow-lg shadow-black/15 hover:bg-brand-dark/90'
                  : 'bg-brand-dark/70 text-white/80 cursor-not-allowed'
              }
            `}
          >
            {isSaving ? 'Saving...' : 'Continue'}
            {!isSaving && <ArrowRight size={15} strokeWidth={2.5} />}
          </motion.button>
        </div>
      </div>
    </div>
  )
}