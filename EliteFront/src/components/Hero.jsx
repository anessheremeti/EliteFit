import { motion } from 'framer-motion'
import { Play, ChevronRight, Star, Dumbbell, Users, Trophy } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-surface">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-sky/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-pink/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 bg-sky/15 text-sky px-4 py-1.5 rounded-full text-sm font-sans font-medium border border-sky/20">
                <Star size={13} fill="currentColor" />
                Premium Performance Platform
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-heading font-bold text-5xl lg:text-6xl xl:text-7xl text-dark leading-[1.05] tracking-tight"
            >
              Train Like
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky to-pink">
                The Elite
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-dark/60 text-lg font-sans leading-relaxed max-w-md"
            >
              Unlock world-class workouts, elite trainers, and real-time progress
              tracking — all designed for peak performance.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <button className="bg-pink text-white font-sans font-medium px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity flex items-center gap-2">
                Get Started Free
                <ChevronRight size={16} />
              </button>
              <button className="border border-dark/10 bg-white text-dark font-sans font-medium px-7 py-3.5 rounded-full hover:bg-dark/5 transition-colors flex items-center gap-2">
                <Play size={15} className="text-sky" fill="#4FC3F7" />
                Watch Demo
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['bg-pink', 'bg-sky', 'bg-purple-400'].map((c, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-surface`} />
                  ))}
                </div>
                <span className="text-sm text-dark/60 font-sans">50k+ athletes</span>
              </div>
              <div className="w-px h-5 bg-dark/10" />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="text-yellow-400" fill="currentColor" />
                ))}
                <span className="text-sm text-dark/60 font-sans ml-1">4.9 rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Featured Workout Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Main card */}
              <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] bg-gradient-to-br from-dark via-dark/95 to-dark/80 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-sky/30 via-transparent to-pink/30" />
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />
                <div className="absolute inset-0 p-8 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="bg-sky/20 text-sky border border-sky/30 text-xs font-sans font-medium px-3 py-1 rounded-full">
                      HIIT Training
                    </span>
                    <span className="text-white/60 text-xs font-sans">45 min</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <button className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/25 transition-colors group">
                      <Play size={32} className="text-white ml-1 group-hover:scale-110 transition-transform" fill="white" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-2xl text-white mb-1">
                      Full Body Blast
                    </h3>
                    <p className="text-white/60 text-sm font-sans">Full Body · 680 kcal est.</p>
                    <div className="mt-4 flex items-center gap-4">
                      {[
                        { icon: Dumbbell, label: 'Advanced' },
                        { icon: Users, label: '12.4k done' },
                        { icon: Trophy, label: 'Top Rated' },
                      ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-1.5">
                          <Icon size={13} className="text-sky" />
                          <span className="text-white/70 text-xs font-sans">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cal card */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-6 top-1/3 bg-white rounded-2xl p-4 shadow-xl border border-black/5"
              >
                <div className="text-2xl font-heading font-bold text-dark">🔥 842</div>
                <div className="text-xs text-dark/50 font-sans mt-0.5">cal burned today</div>
              </motion.div>

              {/* Floating goal card */}
              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -right-6 bottom-1/3 bg-white rounded-2xl p-4 shadow-xl border border-black/5"
              >
                <div className="text-xs text-dark/50 font-sans mb-2">Weekly Goal</div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-dark/10 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-gradient-to-r from-sky to-pink rounded-full" />
                  </div>
                  <span className="text-xs font-heading font-bold text-dark">75%</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
