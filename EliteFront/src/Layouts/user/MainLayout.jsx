import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './navbar/Navbar.jsx';
import UserSidebar from './navbar/Navbar.jsx';   // Shto sidebar-in e userit
import ScrollToTop from '../../components/behavior/ScrollToTop.jsx';

const MainLayout = () => {
  const location = useLocation();

  const data = localStorage.getItem('elitefit_user');
  const user = data ? JSON.parse(data) : null;
  
  // Kontrollojmë llojin e rrugës
  const isStaffRoute = location.pathname.startsWith('/staff') || 
                       ["/members", "/schedule", "/settings"].includes(location.pathname);
                       
  const isUserRoute = location.pathname.startsWith('/user');
  
  const hideNavbarFooter = ["/login", "/signup"].includes(location.pathname);

  // 1. Layout-i me Sidebar (Për Staff dhe User)
  if ((isStaffRoute || isUserRoute) && !hideNavbarFooter) {
    return (
      <div className="min-h-screen bg-surface flex"> {/* Shtuar flex këtu */}
        <ScrollToTop />
        
        {/* Renderon sidebar-in e duhur bazuar në rrugë */}
        {isStaffRoute ? <StaffSidebar /> : <UserSidebar />}

        <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen w-full max-w-full overflow-x-hidden transition-all duration-300">
          <div className="p-4 md:p-0"> {/* Padding opsional për hapësirë ekstra */}
            <Outlet />
          </div>
        </main>
      </div>
    );
  }

  // 2. Layout-i normal (Home, About, etj. me Navbar lart)
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {!hideNavbarFooter && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;