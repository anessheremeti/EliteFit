// src/pages/guest/MainPage.jsx
import Hero from '../../components/Home/Hero'
import StatsBar from '../../components/Home/StatsBar'
import HowItWorks from '../../components/Home/HowItWorks'
//import Nutrition from '../components/Nutrition'
import Pricing from '../../components/Home/Pricing'
import FAQ from '../../components/Home/FAQ'

export default function MainPage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <HowItWorks />
      <Pricing />
      <FAQ />
    </>
  )
}