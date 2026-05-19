import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Plus, Minus } from 'lucide-react'
import { motion } from 'framer-motion'

const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Prefer not to say' },
]

// Convert cm to feet + inches for display
const cmToFtIn = (cm) => {
  const totalIn = Math.round(cm / 2.54)
  return { ft: Math.floor(totalIn / 12), inch: totalIn % 12 }
}

// Convert kg to lbs for display
const kgToLbs = (kg) => Math.round(kg * 2.20462)

export default function ProfilePage() {
  const [gender, setGender] = useState('')
  const [age, setAge] = useState(25)
  const [unit, setUnit] = useState('metric') // 'metric' | 'imperial'
  const [heightCm, setHeightCm] = useState(170)
  const [weightKg, setWeightKg] = useState(70)
  const navigate = useNavigate()

  /* ── Height helpers ── */
  const ftIn = cmToFtIn(heightCm)

  const stepHeight = (delta) => {
    if (unit === 'metric') {
      setHeightCm((v) => Math.min(250, Math.max(100, v + delta)))
    } else {
      setHeightCm((v) => Math.min(250, Math.max(100, Math.round(v + delta * 2.54))))
    }
  }

  const stepFt = (delta) =>
    setHeightCm(() => {
      const newFt = Math.min(8, Math.max(3, ftIn.ft + delta))
      return Math.round((newFt * 12 + ftIn.inch) * 2.54)
    })

  const stepInch = (delta) =>
    setHeightCm(() => {
      const newIn = ftIn.inch + delta
      if (newIn < 0) return Math.round(((ftIn.ft - 1) * 12 + 11) * 2.54)
      if (newIn > 11) return Math.round(((ftIn.ft + 1) * 12 + 0) * 2.54)
      return Math.round((ftIn.ft * 12 + newIn) * 2.54)
    })

  /* ── Weight helpers ── */
  const stepWeight = (delta) => {
    if (unit === 'metric') {
      setWeightKg((v) => Math.min(300, Math.max(30, v + delta)))
    } else {
      const lbs = kgToLbs(weightKg)
      const newLbs = Math.min(660, Math.max(66, lbs + delta))
      setWeightKg(Math.round(newLbs / 2.20462))
    }
  }

  const handleContinue = () => {
    localStorage.setItem(
      'elitefit_onboarding_profile',
      JSON.stringify({ gender, age, heightCm, weightKg })
    )
    navigate('/onboarding/activity')
  }

  const canContinue = gender !== ''

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-16" />

      <div className="max-w-xl mx-auto px-4 pt-8 pb-32">

        {/* Progress card */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-black/[0.07] rounded-2xl px-6 py-4 shadow-sm mb-10"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-dark/35 tracking-widest uppercase font-sans">
              Step 3 of 4
            </span>
            <span className="text-xs font-bold text-brand-accent tracking-widest uppercase font-sans">
              Personalization
            </span>
          </div>
          <div className="h-1 bg-black/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '50%' }}
              animate={{ width: '75%' }}
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
            Tell us about yourself
          </h1>
          <p className="text-dark/45 text-[0.95rem] max-w-sm mx-auto leading-relaxed font-sans">
            This helps us calculate your ideal calorie targets and tailor
            every plan to your body.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-8"
        >

          {/* ── Gender ── */}
          <div>
            <label className="block text-sm font-semibold text-dark/70 font-sans mb-3">
              I identify as
            </label>
            <div className="flex gap-2 flex-wrap">
              {GENDERS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setGender(id)}
                  className={`
                    flex-1 min-w-[90px] py-3 px-4 rounded-2xl border-2 text-sm font-semibold font-sans
                    transition-all duration-200
                    ${
                      gender === id
                        ? 'border-brand-accent bg-brand-accent/5 text-brand-accent'
                        : 'border-black/[0.08] text-dark/60 hover:border-black/20 hover:text-dark'
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Age ── */}
          <div>
            <label className="block text-sm font-semibold text-dark/70 font-sans mb-3">
              Age
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAge((v) => Math.max(13, v - 1))}
                className="w-11 h-11 rounded-full border-2 border-black/[0.08] flex items-center
                           justify-center text-dark/50 hover:border-brand-accent hover:text-brand-accent
                           transition-all duration-200"
              >
                <Minus size={16} strokeWidth={2.5} />
              </button>
              <div className="flex-1 text-center">
                <span className="text-4xl font-heading font-bold text-dark">{age}</span>
                <span className="text-dark/40 ml-2 text-sm font-sans">years</span>
              </div>
              <button
                onClick={() => setAge((v) => Math.min(99, v + 1))}
                className="w-11 h-11 rounded-full border-2 border-black/[0.08] flex items-center
                           justify-center text-dark/50 hover:border-brand-accent hover:text-brand-accent
                           transition-all duration-200"
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* ── Unit toggle ── */}
          <div className="flex items-center gap-2 p-1 bg-black/[0.04] rounded-full w-fit mx-auto">
            {['metric', 'imperial'].map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`
                  px-5 py-2 rounded-full text-xs font-bold font-sans capitalize transition-all duration-200
                  ${unit === u ? 'bg-white shadow-sm text-dark' : 'text-dark/40 hover:text-dark/60'}
                `}
              >
                {u}
              </button>
            ))}
          </div>

          {/* ── Height ── */}
          <div>
            <label className="block text-sm font-semibold text-dark/70 font-sans mb-3">
              Height
            </label>
            {unit === 'metric' ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => stepHeight(-1)}
                  className="w-11 h-11 rounded-full border-2 border-black/[0.08] flex items-center
                             justify-center text-dark/50 hover:border-brand-accent hover:text-brand-accent transition-all"
                >
                  <Minus size={16} strokeWidth={2.5} />
                </button>
                <div className="flex-1 text-center">
                  <span className="text-4xl font-heading font-bold text-dark">{heightCm}</span>
                  <span className="text-dark/40 ml-2 text-sm font-sans">cm</span>
                </div>
                <button
                  onClick={() => stepHeight(1)}
                  className="w-11 h-11 rounded-full border-2 border-black/[0.08] flex items-center
                             justify-center text-dark/50 hover:border-brand-accent hover:text-brand-accent transition-all"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-6">
                {/* Feet */}
                <div className="flex flex-col items-center gap-2">
                  <button onClick={() => stepFt(1)} className="w-9 h-9 rounded-full border-2 border-black/[0.08] flex items-center justify-center text-dark/50 hover:border-brand-accent hover:text-brand-accent transition-all">
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                  <div className="text-center">
                    <span className="text-3xl font-heading font-bold text-dark">{ftIn.ft}</span>
                    <span className="text-dark/40 ml-1 text-sm font-sans">ft</span>
                  </div>
                  <button onClick={() => stepFt(-1)} className="w-9 h-9 rounded-full border-2 border-black/[0.08] flex items-center justify-center text-dark/50 hover:border-brand-accent hover:text-brand-accent transition-all">
                    <Minus size={14} strokeWidth={2.5} />
                  </button>
                </div>
                <span className="text-2xl font-heading text-dark/20 pb-1">'</span>
                {/* Inches */}
                <div className="flex flex-col items-center gap-2">
                  <button onClick={() => stepInch(1)} className="w-9 h-9 rounded-full border-2 border-black/[0.08] flex items-center justify-center text-dark/50 hover:border-brand-accent hover:text-brand-accent transition-all">
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                  <div className="text-center">
                    <span className="text-3xl font-heading font-bold text-dark">{ftIn.inch}</span>
                    <span className="text-dark/40 ml-1 text-sm font-sans">in</span>
                  </div>
                  <button onClick={() => stepInch(-1)} className="w-9 h-9 rounded-full border-2 border-black/[0.08] flex items-center justify-center text-dark/50 hover:border-brand-accent hover:text-brand-accent transition-all">
                    <Minus size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Weight ── */}
          <div>
            <label className="block text-sm font-semibold text-dark/70 font-sans mb-3">
              Weight
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => stepWeight(-1)}
                className="w-11 h-11 rounded-full border-2 border-black/[0.08] flex items-center
                           justify-center text-dark/50 hover:border-brand-accent hover:text-brand-accent transition-all"
              >
                <Minus size={16} strokeWidth={2.5} />
              </button>
              <div className="flex-1 text-center">
                <span className="text-4xl font-heading font-bold text-dark">
                  {unit === 'metric' ? weightKg : kgToLbs(weightKg)}
                </span>
                <span className="text-dark/40 ml-2 text-sm font-sans">
                  {unit === 'metric' ? 'kg' : 'lbs'}
                </span>
              </div>
              <button
                onClick={() => stepWeight(1)}
                className="w-11 h-11 rounded-full border-2 border-black/[0.08] flex items-center
                           justify-center text-dark/50 hover:border-brand-accent hover:text-brand-accent transition-all"
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t border-black/[0.06] z-40">
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/onboarding/goals')}
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
