import MainPage from './pages/MainPage'
import { Routes, Route} from 'react-router-dom';
import { PressKit } from './pages/PressKit';
import Affiliate from './pages/Affiliate';
import Features from './pages/Features';
export default function App() {
  return (
 <Routes>
    <Route path="/" element={<MainPage />} />
    <Route path="/press-kit" element={<PressKit />} />
    <Route path="/features" element={<Features />} />
    <Route path="/affiliates" element={<Affiliate />} />
  </Routes>
  )
 
 
}
