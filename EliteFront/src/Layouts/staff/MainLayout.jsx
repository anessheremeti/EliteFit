import React from 'react';
import { Outlet } from 'react-router-dom';
import { StaffSidebar } from './navbar/Navbar.jsx';
import ScrollToTop from '../../components/behavior/ScrollToTop.jsx';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-surface flex">
      <ScrollToTop />
      <StaffSidebar />

      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen w-full max-w-full overflow-x-hidden transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;