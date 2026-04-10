import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import StatsBar from '../components/StatsBar'
import Recommended from '../components/Recommended'
import HowItWorks from '../components/HowItWorks'
import Nutrition from '../components/Nutrition'
import Pricing from '../components/Pricing'
import FAQ from '../components/FAQ'
import MobileAppCTA from '../components/MobileAppCTA'
import Footer from '../components/Footer'

export default function MainPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <MobileAppCTA />
      </main>
      <Footer />
    </>
  )
}
