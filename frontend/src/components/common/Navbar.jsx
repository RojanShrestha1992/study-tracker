import { useState } from 'react'
import { FiMenu, FiX, FiZap } from 'react-icons/fi'
import { Link } from 'react-router-dom'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
  ]

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-sand bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <FiZap className="text-xl text-primary" />
          <span className="slackey-regular text-2xl text-espresso">StudyMitra</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={{ pathname: '/', hash: link.href }}
              className="text-sm text-[#2a394e] transition-colors hover:text-black"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-lg border border-primary/20 bg-primary-light px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover shadow-warm"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg border border-sand p-2 text-espresso transition-colors hover:border-primary md:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-sand bg-surface/95 px-4 py-4 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={{ pathname: '/', hash: link.href }}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm text-warmgray transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg border border-primary/20 bg-primary-light px-4 py-2 text-center text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary-hover shadow-warm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar