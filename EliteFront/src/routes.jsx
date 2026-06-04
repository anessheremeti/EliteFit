// src/routes.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import MainLayout from './Layouts/guest/MainLayout';
import StaffLayout from './Layouts/staff/MainLayout.jsx';
import UserLayout from './Layouts/user/MainLayout.jsx';
import { ProtectedRoute } from './components/guards/ProtectedRoute.jsx';

/* ==========================================================================
    1. LAZY IMPORTS
   ========================================================================== */
// Guest pages
const MainPage            = lazy(() => import('./pages/guest/Home'));
const LoginPage           = lazy(() => import('./pages/guest/LoginPage'));
const SignupPage          = lazy(() => import('./pages/guest/SignupPage'));
const Affiliate           = lazy(() => import('./pages/guest/Affiliate'));
const Features            = lazy(() => import('./pages/guest/Features'));
const Trainers            = lazy(() => import('./pages/guest/Trainers'));
const Aboutus             = lazy(() => import('./pages/guest/Aboutus'));
const PressKit            = lazy(() => import('./pages/guest/PressKit').then(m => ({ default: m.PressKit })));
const MobileAppComingSoon = lazy(() => import('./pages/guest/coomingsoon').then(m => ({ default: m.MobileAppComingSoon })));
const Workouts            = lazy(() => import('./pages/guest/workout').then(m => ({ default: m.Workouts })));
const HelpCenter          = lazy(() => import('./pages/guest/HelpCenter').then(m => ({ default: m.HelpCenter })));
const Careers             = lazy(() => import('./pages/guest/Careers').then(m => ({ default: m.Careers })));
const Community           = lazy(() => import('./pages/guest/Community').then(m => ({ default: m.Community })));
const Contact             = lazy(() => import('./pages/guest/Contact').then(m => ({ default: m.Contact })));
const PrivacyPolicy       = lazy(() => import('./pages/guest/privacypolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsConditions     = lazy(() => import('./pages/guest/termsandconditions').then(m => ({ default: m.TermsConditions })));
const Cookies             = lazy(() => import('./pages/guest/Cookies').then(m => ({ default: m.Cookies })));
const ForgotPassword      = lazy(() => import('./pages/user/forgot-password'));
const ResetPassword       = lazy(() => import('./pages/user/reset-password'));
const OnboardingAllergies = lazy(() => import('./pages/user/onboarding/AllergiesPage'));
const OnboardingGoals     = lazy(() => import('./pages/user/onboarding/GoalsPage'));
const OnboardingProfile   = lazy(() => import('./pages/user/onboarding/ProfilePage'));
const OnboardingActivity  = lazy(() => import('./pages/user/onboarding/ActivityPage'));

// Staff pages (Admin only)
const StaffDashboard = lazy(() => import('./pages/staff/dashboard'));
const Managment      = lazy(() => import('./pages/staff/user_management/index.jsx'));
const Cms            = lazy(() => import('./pages/staff/cms/index.jsx'));
const Engagement     = lazy(() => import('./pages/staff/engagement/index.jsx'));

// User pages (Member only)
const UserDashboard  = lazy(() => import('./pages/user/dashboard/index.jsx'));
const workoutVideos  = lazy(() => import('./pages/user/workouts/index.jsx'));
const Settings       = lazy(() => import('./pages/user/settings/AccountSettings.jsx'));
const Notifications  = lazy(() => import('./pages/user/notifications/index.jsx'));

/* ==========================================================================
    2. LOADING FALLBACK
   ========================================================================== */
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen bg-surface">
    <div className="w-8 h-8 rounded-full border-2 border-sky border-t-transparent animate-spin" />
  </div>
);

const ChildLoader = () => (
  <div className="flex justify-center items-center h-64">
    <div className="w-6 h-6 rounded-full border-2 border-sky border-t-transparent animate-spin" />
  </div>
);

/* ==========================================================================
    3. ROUTE RENDERER
   ========================================================================== */
export const RenderRoutes = (routes = []) => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {routes.map((route, i) => {
        const Layout = route.layout;
        const Component = route.element;

        // Wrap the layout/element with ProtectedRoute if the route defines allowed roles
        let routeElement;
        if (Layout) {
          routeElement = route.guard
            ? <ProtectedRoute allowedRoles={route.guard}><Layout /></ProtectedRoute>
            : <Layout />;
        } else if (Component) {
          routeElement = <Component />;
        } else {
          routeElement = <Outlet />;
        }

        return (
          <Route key={i} path={route.path} element={routeElement}>
            {route.children && route.children.map((child, index) => {
              const ChildComponent = child.element;
              // Never pass both path and index — React Router v7 treats them as
              // mutually exclusive. Spread only the applicable prop.
              const routeProps = child.index
                ? { index: true }
                : { path: child.path };
              return (
                <Route
                  key={index}
                  {...routeProps}
                  element={
                    <Suspense fallback={<ChildLoader />}>
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
    4. ROUTE CONFIGURATION
   ========================================================================== */
const routes = [
  // ── Public / Guest ────────────────────────────────────────────────────────
  {
    path: '/',
    layout: MainLayout,
    children: [
      { index: true,                  element: MainPage            },
      { path: 'login',                element: LoginPage           },
      { path: 'signup',               element: SignupPage          },
      { path: 'press-kit',            element: PressKit            },
      { path: 'features',             element: Features            },
      { path: 'affiliates',           element: Affiliate           },
      { path: 'trainers',             element: Trainers            },
      { path: 'about-us',             element: Aboutus             },
      { path: 'workouts',             element: Workouts            },
      { path: 'mobile-app',           element: MobileAppComingSoon },
      { path: 'help-center',          element: HelpCenter          },
      { path: 'careers',              element: Careers             },
      { path: 'community',            element: Community           },
      { path: 'contact',              element: Contact             },
      { path: 'privacy-policy',       element: PrivacyPolicy       },
      { path: 'terms-conditions',     element: TermsConditions     },
      { path: 'cookies',              element: Cookies             },
      { path: 'forgot-password',      element: ForgotPassword      },
      { path: 'reset-password',       element: ResetPassword       },
      { path: 'onboarding',           element: OnboardingAllergies },
      { path: 'onboarding/goals',     element: OnboardingGoals     },
      { path: 'onboarding/profile',   element: OnboardingProfile   },
      { path: 'onboarding/activity',  element: OnboardingActivity  },
    ],
  },

  // ── Admin / Staff panel ───────────────────────────────────────────────────
  // guard: ['Admin'] — only users with Admin role can access /staff routes
  {
    path: '/staff',
    layout: StaffLayout,
    guard: ['Admin'],
    children: [
      { index: true,          element: StaffDashboard },
      { path: 'management',   element: Managment      },
      { path: 'Cms',          element: Cms            },
      { path: 'engagement',   element: Engagement     },
    ],
  },

  // ── Member / User panel ───────────────────────────────────────────────────
  // guard: ['Member', 'Admin'] — both roles can view the user panel
  {
    path: '/users',
    layout: UserLayout,
    guard: ['Member', 'Admin'],
    children: [
      { index: true,              element: UserDashboard },
      { path: 'workouts',         element: workoutVideos },
      { path: 'notifications',    element: Notifications },
      { path: 'profile',          element: Settings      },
    ],
  },
];

export default routes;
