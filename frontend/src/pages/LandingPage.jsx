import Footer from '../components/common/Footer.jsx'
import Navbar from '../components/common/Navbar.jsx'
import FeaturesSection from '../components/landing/FeaturesSection.jsx'
import HeroSection from '../components/landing/HeroSection.jsx'
import HowItWorksSection from '../components/landing/HowItWorksSection.jsx'

function LandingPage() {
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