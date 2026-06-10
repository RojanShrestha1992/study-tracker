import Footer from '../components/common/Footer.jsx'
import Navbar from '../components/common/Navbar.jsx'
import FeaturesSection from '../components/landing/FeaturesSection.jsx'
import HeroSection from '../components/landing/HeroSection.jsx'
import HowItWorksSection from '../components/landing/HowItWorksSection.jsx'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function LandingPage() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        const header = document.querySelector('header')
        const headerOffset = header ? header.offsetHeight + 8 : 80
        const elementPosition = el.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - headerOffset
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location])

  return (
    <div className="bg-[#0f0f1a] text-white">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage