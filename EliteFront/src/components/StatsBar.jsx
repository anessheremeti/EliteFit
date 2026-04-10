import { motion } from 'framer-motion'
import { Flame, Target, Zap, Users } from 'lucide-react'

const stats = [
  { icon: Flame, label: 'Day Streak', value: '32', color: 'text-orange-400', bg: 'bg-orange-50' },
  { icon: Target, label: 'Weekly Goal', value: '6/7', color: 'text-sky', bg: 'bg-sky/10' },
  { icon: Zap, label: 'Cal Burned', value: '3,240', color: 'text-pink', bg: 'bg-pink/10' },
  { icon: Users, label: 'Active Now', value: '18.2k', color: 'text-purple-400', bg: 'bg-purple-50' },
]

export default function StatsBar() {
  return (
    <section className="relative z-10 -mt-8 px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-black/5 shadow-xl p-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, label, value, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={color} size={22} />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-dark">{value}</p>
                <p className="text-xs text-dark/50 font-sans mt-0.5">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
