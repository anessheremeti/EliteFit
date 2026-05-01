// src/routes.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import MainLayout from './layouts/guest/MainLayout';
import { path } from 'framer-motion/client';
import StaffLayout from './layouts/staff/MainLayout.jsx';
import UserLayout from './layouts/user/MainLayout.jsx';
/* ==========================================================================
    1. IMPORTET LAZY (Default & Named Exports)
   ========================================================================== */
// Default exports
const MainPage = lazy(() => import('./pages/guest/Home'));
const LoginPage = lazy(() => import('./pages/guest/LoginPage'));
const SignupPage = lazy(() => import('./pages/guest/SignupPage'));
const Affiliate = lazy(() => import('./pages/guest/Affiliate'));
const Features = lazy(() => import('./pages/guest/Features'));
const Trainers = lazy(() => import('./pages/guest/Trainers'));
const Aboutus = lazy(() => import('./pages/guest/Aboutus'));
// Staff Pages
const Dashboard = lazy(() => import('./pages/staff/dashboard'));
// user pages
const dashboardUsers = lazy(() => import('./pages/user/dashboard/index.jsx'));
// Named exports (Për ato që i kishe me kllapa gjarpërore {})
const PressKit = lazy(() => import('./pages/guest/PressKit').then(m => ({ default: m.PressKit })));
const MobileAppComingSoon = lazy(() => import('./pages/guest/coomingsoon').then(m => ({ default: m.MobileAppComingSoon })));
const Workouts = lazy(() => import('./pages/guest/workout').then(m => ({ default: m.Workouts })));
const HelpCenter = lazy(() => import('./pages/guest/HelpCenter').then(m => ({ default: m.HelpCenter })));
const Careers = lazy(() => import('./pages/guest/Careers').then(m => ({ default: m.Careers })));
const Community = lazy(() => import('./pages/guest/Community').then(m => ({ default: m.Community })));
const Contact = lazy(() => import('./pages/guest/Contact').then(m => ({ default: m.Contact })));
const PrivacyPolicy = lazy(() => import('./pages/guest/privacypolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsConditions = lazy(() => import('./pages/guest/termsandconditions').then(m => ({ default: m.TermsConditions })));
const Cookies = lazy(() => import('./pages/guest/Cookies').then(m => ({ default: m.Cookies })));

/* ==========================================================================
    2. RENDER ROUTES LOGIC
   ========================================================================== */
export const RenderRoutes = (routes = []) => (
  <Suspense fallback={<div className="flex justify-center items-center h-screen">Duke u ngarkuar...</div>}>
    <Routes>
      {routes.map((route, i) => {
        const Layout = route.layout;
        const Component = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={Layout ? <Layout /> : (Component ? <Component /> : <Outlet />)}
          >
            {route.children && route.children.map((child, index) => {
              const ChildComponent = child.element;
              return (
                <Route
                  key={index}
                  path={child.path}
                  index={child.index}
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <ChildComponent />
                    </Suspense>
                  }
                />
              );
            })}
          </Route>
        );
      })}
    </Routes>
  </Suspense>
);

/* ==========================================================================
    3. KONFIGURIMI I RUTAVE
   ========================================================================== */
const routes = [
  {
    path: '/',
    layout: MainLayout,
    children: [
      { index: true, element: MainPage },
      { path: 'login', element: LoginPage },
      { path: 'signup', element: SignupPage },
      { path: 'press-kit', element: PressKit },
      { path: 'features', element: Features },
      { path: 'affiliates', element: Affiliate },
      { path: 'trainers', element: Trainers },
      { path: 'about-us', element: Aboutus },
      { path: 'workouts', element: Workouts },
      { path: 'mobile-app', element: MobileAppComingSoon },
      { path: 'help-center', element: HelpCenter },
      { path: 'careers', element: Careers },
      { path: 'community', element: Community },
      { path: 'contact', element: Contact },
      { path: 'privacy-policy', element: PrivacyPolicy },
      { path: 'terms-conditions', element: TermsConditions },
      { path: 'cookies', element: Cookies },
    ],    
  },
  {
    path: '/staff',
    layout: StaffLayout,
    children: [
      { index: true, element: Dashboard },
    ],
  },
  {
    path: '/users',
    layout: UserLayout,
    children: [
      { index: true, element: dashboardUsers },
    ],
  }
];

export default routes;