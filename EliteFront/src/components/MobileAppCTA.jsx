import { motion } from 'framer-motion'
import { Apple, Smartphone, Star, Zap } from 'lucide-react'

export default function MobileAppCTA() {
  return (
    <section className="bg-dark py-24 px-6 lg:px-8 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-1/4 w-96 h-96 rounded-full bg-sky/10 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 rounded-full bg-pink/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-6"
          >
            <span className="inline-flex items-center gap-2 text-sky text-sm font-sans font-medium tracking-widest uppercase">
              <Zap size={13} fill="currentColor" /> Mobile App
            </span>
            <h2 className="font-heading font-bold text-4xl lg:text-5xl text-white leading-tight">
              Take Your Training
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky to-pink">
                Anywhere
              </span>
            </h2>
            <p className="text-white/60 font-sans leading-relaxed max-w-md">
              Download the EliteFitPro app and train wherever you are. Full offline support,
              seamless device sync, and a beautiful UI built for peak performance.
            </p>

            <div className="flex items-center gap-6">
              {[
                { label: '4.9 App Store' },
                { label: '4.8 Google Play' },
              ].map(({ label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="text-yellow-400" fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-white/40 text-xs font-sans">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-2">
              <button className="flex items-center gap-3 bg-white text-dark px-6 py-3.5 rounded-2xl hover:bg-white/90 transition-colors">
                <Apple size={22} />
                <div className="text-left">
                  <div className="text-[10px] text-dark/50 font-sans">Download on the</div>
                  <div className="font-heading font-bold text-sm">App Store</div>
                </div>
              </button>
              <button className="flex items-center gap-3 bg-white/10 border border-white/15 text-white px-6 py-3.5 rounded-2xl hover:bg-white/15 transition-colors backdrop-blur-sm">
                <Smartphone size={22} />
                <div className="text-left">
                  <div className="text-[10px] text-white/50 font-sans">Get it on</div>
                  <div className="font-heading font-bold text-sm">Google Play</div>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Right — Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Phone frame */}
              <div className="w-56 h-[480px] rounded-[3.5rem] bg-gradient-to-b from-white/20 to-white/5 border-2 border-white/20 relative overflow-hidden shadow-2xl">
                {/* Screen */}
                <div className="absolute inset-[3px] rounded-[3.3rem] bg-gradient-to-br from-sky/10 via-dark to-pink/10 overflow-hidden">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-5 pt-4 pb-2">
                    <span className="text-white/60 text-[10px] font-sans">9:41</span>
                    <div className="w-14 h-3.5 bg-dark/80 rounded-full" />
                    <div className="w-6 h-3 rounded-sm bg-white/30" />
                  </div>

                  {/* App content mockup */}
                  <div className="px-4 pt-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="w-20 h-2.5 bg-white/20 rounded-full" />
                        <div className="w-28 h-3.5 bg-white/40 rounded-full" />
                      </div>
                      <div className="w-9 h-9 rounded-full bg-sky/30 border border-sky/20" />
                    </div>

                    {/* Stats row */}
                    <div className="flex gap-2">
                      {['bg-sky/20', 'bg-pink/20', 'bg-emerald-500/20'].map((bg, i) => (
                        <div key={i} className={`flex-1 ${bg} rounded-xl p-2.5`}>
                          <div className="w-5 h-5 rounded-lg bg-white/20 mb-2" />
                          <div className="w-8 h-2.5 bg-white/30 rounded mb-1" />
                          <div className="w-12 h-2 bg-white/15 rounded" />
                        </div>
                      ))}
                    </div>

                    {/* Workout cards */}
                    {[
                      { from: 'from-sky', to: 'to-blue-600' },
                      { from: 'from-pink', to: 'to-rose-600' },
                    ].map(({ from, to }, i) => (
                      <div
                        key={i}
                        className="bg-white/10 rounded-2xl p-3 flex items-center gap-3"
                      >
                        <div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${from} ${to} shrink-0`}
                        />
                        <div className="flex-1 space-y-1.5">
                          <div className="w-24 h-2.5 bg-white/30 rounded" />
                          <div className="w-16 h-2 bg-white/15 rounded" />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
                          <div
                            className="w-0 h-0 ml-0.5"
                            style={{
                              borderTop: '4px solid transparent',
                              borderBottom: '4px solid transparent',
                              borderLeft: '6px solid rgba(255,255,255,0.6)',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Home indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full" />
              </div>

              {/* Floating notification */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -right-8 top-16 bg-white rounded-2xl p-3 shadow-xl border border-black/5 w-36"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-sky/20 flex items-center justify-center">
                    <Zap size={10} className="text-sky" fill="currentColor" />
                  </div>
                  <span className="text-[10px] text-dark/50 font-sans">EliteFitPro</span>
                </div>
                <p className="text-[11px] font-heading font-bold text-dark">Workout complete! 🔥</p>
                <p className="text-[10px] text-dark/40 font-sans">+450 cal burned</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
