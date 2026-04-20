import MainPage from './pages/MainPage'
import { Routes, Route} from 'react-router-dom';
import { PressKit } from './pages/PressKit';
export default function App() {
  return (
 <Routes>
    <Route path="/" element={<MainPage />} />
    <Route path="/press-kit" element={<PressKit />} />
  </Routes>
  )
 
 
}
