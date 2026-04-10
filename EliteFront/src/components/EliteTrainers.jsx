import { motion } from 'framer-motion'
import { Star, ArrowRight } from 'lucide-react'

const trainers = [
  { name: 'Alex Rivera', specialty: 'HIIT & Functional', rating: 4.9, students: '12.4k', initials: 'AR', gradient: 'from-sky to-blue-600' },
  { name: 'Maya Chen', specialty: 'Yoga & Mindfulness', rating: 5.0, students: '9.8k', initials: 'MC', gradient: 'from-pink to-rose-600' },
  { name: 'Jordan Lee', specialty: 'Cardio & Endurance', rating: 4.8, students: '15.2k', initials: 'JL', gradient: 'from-emerald-400 to-teal-600' },
  { name: 'Sam Park', specialty: 'Strength & Power', rating: 4.9, students: '11.7k', initials: 'SP', gradient: 'from-purple-400 to-indigo-600' },
  { name: 'Taylor Brooks', specialty: 'Pilates & Core', rating: 4.9, students: '8.3k', initials: 'TB', gradient: 'from-orange-400 to-amber-600' },
  { name: 'Morgan West', specialty: 'Boxing & MMA', rating: 4.7, students: '18.9k', initials: 'MW', gradient: 'from-red-400 to-rose-700' },
]

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

export default function EliteTrainers() {
  return (
    <section id="trainers" className="py-24 px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-sky text-sm font-sans font-medium tracking-widest uppercase">
            World-Class
          </span>
          <h2 className="font-heading font-bold text-4xl text-dark mt-2">Elite Trainers</h2>
          <p className="text-dark/50 font-sans mt-3 max-w-md">
            Train with certified professionals who have helped thousands reach their peak.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {trainers.map((trainer) => (
            <motion.div
              key={trainer.name}
              variants={fadeUp}
              className="group relative bg-white rounded-[2rem] overflow-hidden border border-black/5 hover:shadow-xl transition-all duration-300"
            >
              {/* Avatar area */}
              <div
                className={`relative h-48 bg-gradient-to-br ${trainer.gradient} flex items-center justify-center`}
              >
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center">
                  <span className="font-heading font-bold text-2xl text-white">
                    {trainer.initials}
                  </span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <button className="bg-white text-dark font-sans font-medium text-sm px-6 py-2.5 rounded-full flex items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    View Profile <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-heading font-bold text-lg text-dark">{trainer.name}</h3>
                <p className="text-dark/50 text-sm font-sans mt-0.5">{trainer.specialty}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                    <span className="font-heading font-bold text-sm text-dark">{trainer.rating}</span>
                  </div>
                  <span className="text-xs text-dark/40 font-sans">{trainer.students} students</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
