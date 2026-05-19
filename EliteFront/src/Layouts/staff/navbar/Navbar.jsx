import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Dumbbell, 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  FileCog,
  BellRing,
  Settings, 
  LogOut 
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogoutModal } from '../../../components/modal/LogoutModal';

// Lidhjet për panelin e stafit me ikona përkatëse
const links = [
  { href: '/staff', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/staff/management', label: 'Management', icon: Users },
  { href: '/staff/Cms', label: 'Content Management', icon: FileCog },
  { href: '/staff/engagement', label: 'Engagement', icon: BellRing },
];

export function StaffSidebar() {
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('elitefit_user');
    setLogoutOpen(false);
    navigate('/login', { replace: true });
  };

  const data = localStorage.getItem('elitefit_user');
  const user = data ? JSON.parse(data) : null;

  // Funksioni për renderimin e listës së navigimit
  const NavLinks = ({ mobile = false }) => (
    <nav className="flex flex-col gap-2 mt-8 px-4">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = location.pathname === href;
        return (
          <Link
            key={label}
            to={href}
            onClick={() => mobile && setOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-sans font-medium ${
              isActive
                ? 'bg-pink/10 text-pink'
                : 'text-dark/60 hover:bg-surface hover:text-dark'
            }`}
          >
            <Icon size={20} className={isActive ? 'text-pink' : 'text-dark/60'} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* 
        ========================================
        MOBILE TOP BAR (Dukshëm vetëm në Mobile)
        ========================================
      */}
      <header className="md:hidden fixed inset-x-0 top-0 z-40 bg-white border-b border-black/5 shadow-sm h-16 px-4 flex items-center justify-between">
        <Link to="/staff" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink to-pink/80 flex items-center justify-center shadow-sm">
            <Dumbbell size={16} fill="white" className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-heading font-bold text-lg text-dark">EliteFit</span>
        </Link>
        <button
          className="p-2 text-dark/70 hover:text-dark rounded-md hover:bg-surface"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* 
        ========================================
        DESKTOP SIDEBAR (Fiksuar majtas)
        ========================================
      */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-64 bg-white border-r border-black/5 z-50 shadow-sm">
        <div className="p-6">
          <Link to="/dashboard" className="group flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink to-pink/80 flex items-center justify-center shadow-sm group-hover:scale-105 transition-all duration-300">
              <Dumbbell size={20} fill="white" className="text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-heading font-bold text-xl text-dark">EliteFit</span>
              <span className="font-heading font-bold text-[10px] text-pink tracking-wider">
                STAFF PANEL
              </span>
            </div>
          </Link>
        </div>

        {/* Lidhjet e Navigimit (Desktop) */}
        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>

        {/* Profili dhe Logout (Desktop) */}
        <div className="p-4 border-t border-black/5 mt-auto">
          <div className="flex flex-col gap-3 mb-2 px-2">
            <span className="text-sm font-medium text-dark truncate">
              {user?.fullName || 'Staff Member'}
            </span>
          </div>
          <button
            onClick={() => setLogoutOpen(true)}
            className="flex w-full items-center gap-2 rounded-xl bg-red-50 text-red-600 px-4 py-3 text-sm font-sans font-medium transition hover:bg-red-100 focus:outline-none"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      {/* 
        ========================================
        MOBILE SIDEBAR (Slide in from Left)
        ========================================
      */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }} // Ndryshuar nga e djathta në të majtë
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-[70] w-72 bg-white flex flex-col p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink to-pink/80 flex items-center justify-center shadow-sm">
                    <Dumbbell size={16} fill="white" className="text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="font-heading font-bold text-base text-dark">EliteFit</span>
                    <span className="font-heading font-bold text-[10px] text-pink tracking-wider">STAFF</span>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-1 text-dark/60 hover:text-dark">
                  <X size={20} />
                </button>
              </div>

              <div className="-mx-4">
                <NavLinks mobile={true} />
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-black/5">
                <span className="text-sm font-medium text-dark/80 px-2 truncate">
                  {user?.fullName || 'Staff Member'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setLogoutOpen(true);
                  }}
                  className="w-full flex justify-center items-center gap-2 rounded-xl bg-red-50 text-red-600 px-4 py-3 text-sm font-sans font-medium transition hover:bg-red-100"
                >
                  <LogOut size={18} />
                  Log out
                </button>
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
  );
}