import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Dumbbell } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogoutModal } from './LogoutModal'

const links = [
  { href: '/features', label: 'Features' },
  { href: '/trainers', label: 'Trainers' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Kontrollojmë nëse jemi në Home Page
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Funksioni për Smooth Scroll nëse klikohet Logoja ose Linku lart
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('elitefit_user')
    setLogoutOpen(false)
    navigate('/login', { replace: true })
  }

  const data = localStorage.getItem('elitefit_user')
  const user = data ? JSON.parse(data) : null

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || !isHomePage
            ? 'bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-sm'
            : 'bg-surface' // Ktheva ngjyrën tënde origjinale
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link 
            to="/" 
            onClick={scrollToTop}
            className="group flex items-center gap-3 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2 rounded-lg px-1 -ml-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink to-pink/80 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
              <Dumbbell size={18} fill="white" className="" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-heading font-bold text-lg text-dark group-hover:text-sky transition-colors duration-300">
                EliteFit
              </span>
              <span className="font-heading font-bold text-xs text-pink tracking-wider">
                PRO
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={label}
                to={href}
                className="text-sm text-dark/60 hover:text-dark transition-colors font-sans font-medium"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {
              user ? (
                
                <div className='flex flex-row items-center gap-2'>
                  <span className="text-sm text-dark/60 hover:text-dark transition-colors px-4 py-2 font-sans">
                    {user.fullName}
                  </span>
                  <button
                    type="button"
                    className='flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-sans text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300'
                    onClick={() => setLogoutOpen(true)}
                  >
                    Log out
                  </button>
                </div>
              
              ) :  
              (
                <>
                 <Link to="/login" className="text-sm text-dark/60 hover:text-dark transition-colors px-4 py-2 font-sans">
              Sign in
            </Link>
            <Link to="/signup" className="bg-pink text-blaack text-sm font-sans font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
              Start Free
            </Link></>
              )
            }
           
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
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-72 bg-white flex flex-col p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink to-pink/80 flex items-center justify-center shadow-sm">
                    <Dumbbell size={16} fill="white" className="text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="font-heading font-bold text-base text-dark">
                      EliteFit
                    </span>
                    <span className="font-heading font-bold text-xs text-pink tracking-wider">
                      PRO
                    </span>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-1 text-dark/60 hover:text-dark">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {links.map(({ href, label }) => (
                  <Link
                    key={label}
                    to={href}
                    onClick={() => setOpen(false)}
                    className="text-dark/70 hover:text-dark hover:bg-surface px-4 py-3 rounded-xl transition-colors font-sans"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-black/5">
                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      setLogoutOpen(true)
                    }}
                    className="w-full rounded-full bg-red-500 px-4 py-3 text-sm font-sans font-medium text-white transition hover:bg-red-600"
                  >
                    Log out
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="text-dark/70 font-sans py-2.5 text-center">Sign in</Link>
                    <Link to="/signup" onClick={() => setOpen(false)} className="bg-pink text-white font-sans font-medium py-3 rounded-full hover:opacity-90 transition-opacity text-center">
                      Start Free
                    </Link>
                  </>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        userName={user?.fullName}
      />
    </>
  )
}