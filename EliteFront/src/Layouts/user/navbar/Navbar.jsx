import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Dumbbell,
  LayoutDashboard,
  CalendarDays,
  Settings,
  LogOut,
  User,
  Trophy,
  Apple
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogoutModal } from '../../../components/modal/LogoutModal';

const links = [
  { href: '/users',            label: 'My Progress', icon: LayoutDashboard },
  { href: '/users/workouts',    label: 'Workouts',    icon: Dumbbell },
  { href: '/users/nutrition',   label: 'Nutrition',   icon: Apple },
  { href: '/users/goals',       label: 'Goals',       icon: Trophy },
  { href: '/users/profile',     label: 'Profile',     icon: User },
  { href: '/users/settings',    label: 'Settings',    icon: Settings },
];

function NavLinks({ location, onLinkClick }) {
  return (
    <nav className="flex flex-col gap-1 mt-6 px-3">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = location.pathname === href;
        return (
          <Link
            key={href}
            to={href}
            onClick={onLinkClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 font-sans font-medium text-sm ${
              isActive
                ? 'bg-sky/15 text-gray-200'
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            <Icon size={18} className={isActive ? 'text-sky' : 'text-gray-500'} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function UserAvatar({ initials, size = 'md' }) {
  const dim = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-sm';
  return (
    <div className={`${dim} rounded-full bg-linear-to-br from-sky to-sky/60 flex items-center justify-center text-white font-bold shrink-0`}>
      {initials}
    </div>
  );
}

export function UserSidebar() {
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

  const initials = user?.fullName
    ?.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'M';

  return (
    <>
      {/* MOBILE TOP BAR */}
      <header className="md:hidden fixed inset-x-0 top-0 z-40 bg-white border-b border-black/5 shadow-sm h-16 px-4 flex items-center justify-between w-full max-w-full overflow-x-hidden">
        <Link to="/users" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-sky to-sky/80 flex items-center justify-center shadow-sm">
            <Dumbbell size={16} fill="white" className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-heading font-bold text-lg text-dark">EliteFit</span>
        </Link>
        <button className="p-2 text-dark/70" onClick={() => setOpen(true)}>
          <Menu size={24} />
        </button>
      </header>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-64 bg-[#1f2932] border-r border-white/5 z-50 shadow-sm">
        <div className="p-6">
          <Link to="/users" className="group flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-sky to-sky/80 flex items-center justify-center shadow-sm">
              <Dumbbell size={20} fill="white" className="text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-heading font-bold text-xl text-gray-100">EliteFit</span>
              <span className="font-heading font-bold text-[10px] text-gray-100 tracking-wider uppercase">
                Member Panel
              </span>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          <NavLinks location={location} onLinkClick={null} />
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <UserAvatar initials={initials} size="md" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-200 truncate leading-tight">
                {user?.fullName || 'Member'}
              </p>
              <p className="text-xs text-gray-500 leading-tight">Member</p>
            </div>
          </div>
          <button
            onClick={() => setLogoutOpen(true)}
            className="group mt-1 flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut size={17} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="text-sm font-medium">Sign out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR SLIDE-IN */}
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
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-[70] w-72 bg-white flex flex-col p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky flex items-center justify-center text-white">
                    <Dumbbell size={16} fill="white" />
                  </div>
                  <span className="font-heading font-bold text-dark uppercase tracking-tight">EliteFit</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-dark/50 hover:bg-surface hover:text-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="-mx-2 flex-1 overflow-y-auto">
                <NavLinks location={location} onLinkClick={() => setOpen(false)} />
              </div>

              <div className="mt-auto pt-4 border-t border-black/5">
                <div className="flex items-center gap-3 px-2 py-2 mb-3">
                  <UserAvatar initials={initials} size="sm" />
                  <span className="text-sm font-semibold text-dark truncate">
                    {user?.fullName || 'Member'}
                  </span>
                </div>
                <button
                  onClick={() => { setOpen(false); setLogoutOpen(true); }}
                  className="group w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-600 py-3 text-sm font-semibold hover:bg-red-600 hover:text-white hover:border-red-600 active:scale-[0.98] transition-all duration-150"
                >
                  <LogOut size={17} />
                  Sign out
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
