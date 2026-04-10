import { motion } from 'framer-motion'
import { UserPlus, Sliders, Dumbbell, BarChart3 } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Join',
    desc: 'Create your free account in seconds. No credit card required to get started.',
    color: 'text-sky',
    bg: 'bg-sky/10',
    border: 'border-sky/20',
  },
  {
    number: '02',
    icon: Sliders,
    title: 'Personalize',
    desc: 'Set your goals, diet type, allergies, and activity level. We build your calorie target and workout plan from your profile.',
    color: 'text-purple-400',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
  {
    number: '03',
    icon: Dumbbell,
    title: 'Train',
    desc: 'Browse workout videos by category, muscle group, and difficulty. Stream or download for offline sessions.',
    color: 'text-pink',
    bg: 'bg-pink/10',
    border: 'border-pink/20',
  },
  {
    number: '04',
    icon: BarChart3,
    title: 'Track',
    desc: 'Watch your streak grow, earn badges, log calories burned, and hit your weekly workout goal.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
]

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sky text-sm font-sans font-medium tracking-widest uppercase">
            Simple Process
          </span>
          <h2 className="font-heading font-bold text-4xl text-dark mt-3">How It Works</h2>
          <p className="text-dark/50 font-sans mt-4 max-w-md mx-auto">
            From signup to your first workout in under 5 minutes. No complexity, just results.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map(({ number, icon: Icon, title, desc, color, bg, border }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className={`relative p-7 rounded-[2rem] bg-surface border ${border} hover:shadow-lg transition-all duration-300 group`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
                  <Icon className={color} size={22} />
                </div>
                <span
                  className={`font-heading font-bold text-4xl ${color} opacity-20 group-hover:opacity-40 transition-opacity`}
                >
                  {number}
                </span>
              </div>
              <h3 className="font-heading font-bold text-xl text-dark mb-2">{title}</h3>
              <p className="text-dark/50 text-sm font-sans leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
