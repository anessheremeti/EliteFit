import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#trainers', label: 'Trainers' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-sm'
            : 'bg-surface'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-sky flex items-center justify-center">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-heading font-bold text-xl text-dark">
              EliteFit<span className="text-pink">Pro</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {links.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-dark/60 hover:text-dark transition-colors font-sans"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button className="text-sm text-dark/60 hover:text-dark transition-colors px-4 py-2 font-sans">
              Sign in
            </button>
            <button className="bg-pink text-white text-sm font-sans font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
              Start Free
            </button>
          </div>

          <button
            className="md:hidden p-1 text-dark"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-white flex flex-col p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <span className="font-heading font-bold text-xl text-dark">
                  EliteFit<span className="text-pink">Pro</span>
                </span>
                <button onClick={() => setOpen(false)} className="p-1 text-dark/60 hover:text-dark">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {links.map(({ href, label }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="text-dark/70 hover:text-dark hover:bg-surface px-4 py-3 rounded-xl transition-colors font-sans"
                  >
                    {label}
                  </a>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-black/5">
                <button className="text-dark/70 font-sans py-2.5">Sign in</button>
                <button className="bg-pink text-white font-sans font-medium py-3 rounded-full hover:opacity-90 transition-opacity">
                  Start Free
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
