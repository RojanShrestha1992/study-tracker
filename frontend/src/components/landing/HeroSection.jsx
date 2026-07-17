import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-hero px-6 pt-28 text-espresso sm:pt-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(124,58,237,0.15),transparent_32%),radial-gradient(circle_at_85%_40%,rgba(6,182,212,0.15),transparent_30%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-center">
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-center">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex rounded-full border border-sand bg-surface px-4 py-1 text-sm text-primary">
              🎮 Level Up Your Studies
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-espresso sm:text-4xl lg:text-5xl">
              Study Smarter,
              <span className="block bg-gradient-badge bg-clip-text text-transparent">
                Level Up Faster
              </span>
            </h1>
            <p className="mx-auto mt-4 mb-8 max-w-lg text-lg text-warmgray lg:mx-0">
              Transform your study sessions into an epic adventure. Earn XP, unlock achievements,
              maintain streaks, and compete with friends, all while actually learning.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link
                to="/register"
                className="rounded-xl bg-primary px-8 py-3 font-semibold text-white transition-transform hover:scale-105 shadow-warm"
              >
                Start Your Journey
              </Link>
              <a
                href="#how-it-works"
                className="rounded-xl border border-sand bg-surface px-8 py-3 font-semibold text-primary transition-colors hover:border-primary"
              >
                See How It Works
              </a>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-3xl border border-sand bg-surface p-6 shadow-warm-lg">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-lg font-bold text-white">
                  A
                </div>
                <div>
                  <p className="font-semibold text-espresso">Alex Johnson</p>
                  <p className="text-sm text-primary">Level 12 Scholar</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-warmgray">XP Progress</span>
                  <span className="text-espresso">2,450 / 3,000 XP</span>
                </div>
                <div className="h-3 rounded-full bg-sand">
                  <div className="h-3 w-4/5 rounded-full bg-gradient-xp" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { value: '🔥 15', label: 'Day Streak' },
                  { value: '⚡ 2,450', label: 'Total XP' },
                  { value: '📚 8', label: 'Subjects' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-sand bg-cream p-3 text-center">
                    <p className="text-lg font-bold text-espresso">{stat.value}</p>
                    <p className="text-xs text-warmgray">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <p className="mb-2 text-sm text-warmgray">Recent Badges</p>
                <div className="flex gap-3">
                  {['🏆', '🎯', '🔥', '⭐'].map((badge) => (
                    <div
                      key={badge}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-lg"
                    >
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection