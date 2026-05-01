// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './navbar/Navbar.jsx';
import Footer from './footer/Footer.jsx';
import ScrollToTop from '../../components/behavior/ScrollToTop.jsx';

const MainLayout = () => {
  const location = useLocation();

  // Lista e rrugëve ku nuk dëshiron të shfaqet Navbar dhe Footer
  const hideNavbarFooter = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      
      {!hideNavbarFooter && <Navbar />}
      
      <main className="flex-grow">
        {/* Këtu do të renderizohen faqet (MainPage, Aboutus, etj.) */}
        <Outlet />
      </main>

      {!hideNavbarFooter && <Footer />}
    </div>
  );
};

export default MainLayout;