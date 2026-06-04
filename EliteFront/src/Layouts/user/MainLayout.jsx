import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserSidebar } from './navbar/Navbar.jsx';
import ScrollToTop from '../../components/behavior/ScrollToTop.jsx';
import { ErrorBoundary } from '../../components/ErrorBoundary.jsx';

function PageError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
      <p className="text-base font-semibold text-gray-700">This page ran into an error.</p>
      <p className="text-sm text-gray-400">Try refreshing, or navigate to another section.</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-5 py-2 rounded-full bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 transition-colors"
      >
        Refresh
      </button>
    </div>
  );
}

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-surface flex">
      <ScrollToTop />
      <UserSidebar />

      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen w-full max-w-full overflow-x-hidden transition-all duration-300">
        <div className="p-4 md:p-0">
          <ErrorBoundary fallback={<PageError />}>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
