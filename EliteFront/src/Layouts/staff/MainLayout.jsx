import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './navbar/Navbar.jsx';
import StaffSidebar from './navbar/Navbar.jsx'; // FIX: Importo StaffSidebar, jo Navbar
import ScrollToTop from '../../components/behavior/ScrollToTop.jsx';

const MainLayout = () => {
  const location = useLocation();

  const data = localStorage.getItem('elitefit_user');
  const user = data ? JSON.parse(data) : null;
  
  // Kontrolli i ri: Nëse rruga fillon me /staff ose /user, përdor Sidebar
  const isStaffRoute = location.pathname.startsWith('/staff') || 
                       ["/members", "/schedule", "/settings"].includes(location.pathname);
  const isUserRoute = location.pathname.startsWith('/user');
  
  const hideNavbarFooter = ["/login", "/signup"].includes(location.pathname);

  // Layout me Sidebar (për Staff dhe User)
  if ((isStaffRoute || isUserRoute) && !hideNavbarFooter) {
    return (
      <div className="min-h-screen bg-surface flex">
        <ScrollToTop />
        
        {/* Shfaq sidebar-in e duhur bazuar në rrugë */}
        {isStaffRoute ? <StaffSidebar /> : <UserSidebar />}

        <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen w-full max-w-full overflow-x-hidden transition-all duration-300">
          <Outlet />
        </main>
      </div>
    );
  }

  // Layout normal (Guest/Landing Page)
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