import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserSidebar } from './navbar/Navbar.jsx';
import ScrollToTop from '../../components/behavior/ScrollToTop.jsx';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-surface flex">
      <ScrollToTop />
      <UserSidebar />

      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen w-full max-w-full overflow-x-hidden transition-all duration-300">
        <div className="p-4 md:p-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;