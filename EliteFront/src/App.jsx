import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { PressKit } from './pages/PressKit';
import Affiliate from './pages/Affiliate';
import Features from './pages/Features';
import Trainers from './pages/Trainers';
import Aboutus from './pages/Aboutus';
import { MobileAppComingSoon } from './pages/coomingsoon';
import { Workouts } from './pages/workout';
import { HelpCenter } from './pages/HelpCenter';
import { Careers } from './pages/Careers';
import { Community } from './pages/Community';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/privacypolicy';
import { TermsConditions } from './pages/termsandconditions';
import  Cookies  from './pages/Cookies';
import ScrollToTop from './components/ScrollToTop';
export default function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/press-kit" element={<PressKit />} />
      <Route path="/features" element={<Features />} />
      <Route path="/affiliates" element={<Affiliate />} />
      <Route path="/trainers" element={<Trainers />} />
      <Route path="/about-us" element={<Aboutus />} />
      <Route path="/workouts" element={<Workouts />} />
      <Route path="/mobile-app" element={<MobileAppComingSoon />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/community" element={<Community />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-conditions" element={<TermsConditions />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
    </>
  );
}