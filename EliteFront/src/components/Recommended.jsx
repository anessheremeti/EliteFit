import { motion } from 'framer-motion'
import { Play, Clock, Flame, ChevronRight, Dumbbell } from 'lucide-react'

const featured = {
  title: 'Morning Power Flow',
  muscleGroup: 'Full Body',
  duration: '38 min',
  calories: '520 kcal',
  difficulty: 'Intermediate',
  category: 'Yoga + Strength',
  gradient: 'from-indigo-900 via-purple-900 to-pink-900',
  accent: 'from-purple-300 to-pink-300',
}

const workouts = [
  {
    title: 'Core Crusher',
    muscleGroup: 'Core & Abs',
    duration: '22 min',
    calories: '280 kcal',
    difficulty: 'Advanced',
    category: 'Core',
    gradient: 'from-emerald-900 to-teal-900',
  },
  {
    title: 'Speed Run',
    muscleGroup: 'Legs & Cardio',
    duration: '30 min',
    calories: '410 kcal',
    difficulty: 'Intermediate',
    category: 'Cardio',
    gradient: 'from-orange-900 to-red-900',
  },
  {
    title: 'Upper Body Blast',
    muscleGroup: 'Chest & Back',
    duration: '45 min',
    calories: '380 kcal',
    difficulty: 'Beginner',
    category: 'Strength',
    gradient: 'from-sky-900 to-blue-900',
  },
]

const difficultyColor = {
  Beginner: 'text-emerald-300',
  Intermediate: 'text-yellow-300',
  Advanced: 'text-red-300',
}

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

export default function Recommended() {
  return (
    <section id="features" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
          <div>
            <span className="text-sky text-sm font-sans font-medium tracking-widest uppercase">
              Curated For You
            </span>
            <h2 className="font-heading font-bold text-4xl text-dark mt-2">
              Recommended Workouts
            </h2>
          </div>
          <a
            href="#"
            className="hidden md:flex items-center gap-1 text-sm text-dark/50 hover:text-dark transition-colors font-sans"
          >
            View all <ChevronRight size={15} />
          </a>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-5">
          {/* Featured large card */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-3 relative rounded-[2rem] overflow-hidden aspect-[3/2] lg:aspect-auto lg:min-h-[400px] cursor-pointer group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${featured.gradient}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col">
              <div className="flex items-start justify-between">
                <span className="bg-white/15 text-white border border-white/20 text-xs font-sans font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {featured.category}
                </span>
                <span className={`text-xs font-sans font-medium ${difficultyColor[featured.difficulty]}`}>
                  {featured.difficulty}
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                  <Play size={24} className="text-white ml-1" fill="white" />
                </div>
              </div>
              <div>
                <h3
                  className={`font-heading font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r ${featured.accent} mb-1`}
                >
                  {featured.title}
                </h3>
                <div className="flex items-center gap-1.5 text-white/60 text-xs font-sans mb-3">
                  <Dumbbell size={11} />
                  {featured.muscleGroup}
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-white/60 text-xs font-sans">
                    <Clock size={12} /> {featured.duration}
                  </span>
                  <span className="flex items-center gap-1.5 text-white/60 text-xs font-sans">
                    <Flame size={12} /> {featured.calories}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Small cards */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {workouts.map((w) => (
              <motion.div
                key={w.title}
                variants={fadeUp}
                className="relative rounded-[1.5rem] overflow-hidden flex-1 min-h-[110px] cursor-pointer group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${w.gradient}`} />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 p-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white/60 text-xs font-sans">{w.category}</span>
                      <span className={`text-xs font-sans ${difficultyColor[w.difficulty]}`}>
                        · {w.difficulty}
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-white text-lg">{w.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-white/50 text-xs font-sans">
                        <Dumbbell size={10} /> {w.muscleGroup}
                      </span>
                      <span className="flex items-center gap-1 text-white/50 text-xs font-sans">
                        <Flame size={10} /> {w.calories}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0">
                    <Play size={15} className="text-white ml-0.5" fill="white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
