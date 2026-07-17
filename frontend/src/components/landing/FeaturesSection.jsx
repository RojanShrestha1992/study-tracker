import {
  FiAward,
  FiBarChart2,
  FiClock,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi'

const features = [
  {
    title: 'Pomodoro Timer',
    description:
      'Stay focused with built-in Pomodoro sessions. Study for 25 minutes, take a break, and repeat for maximum productivity.',
    icon: FiClock,
    gradient: 'from-[#7c3aed] to-[#5b21b6]',
  },
  {
    title: 'XP & Leveling',
    description:
      'Earn experience points for every minute you study. Level up your profile and unlock new ranks as you progress.',
    icon: FiZap,
    gradient: 'from-[#06b6d4] to-[#0284c7]',
  },
  {
    title: 'Daily Streaks',
    description:
      'Build momentum with daily study streaks. Consecutive days of studying keep your streak alive and earn bonus XP.',
    icon: FiTrendingUp,
    gradient: 'from-[#f59e0b] to-[#d97706]',
  },
  {
    title: 'Badges & Achievements',
    description:
      'Unlock badges for hitting milestones. First session, 7-day streak, 100 study hours — collect them all.',
    icon: FiAward,
    gradient: 'from-[#10b981] to-[#059669]',
  },
  {
    title: 'Leaderboard',
    description:
      'See where you rank among other students. Healthy competition drives motivation and keeps you pushing forward.',
    icon: FiUsers,
    gradient: 'from-[#ef4444] to-[#dc2626]',
  },
  {
    title: 'Study Analytics',
    description:
      'Visualize your progress with charts and graphs. Track study hours per subject and identify where to improve.',
    icon: FiBarChart2,
    gradient: 'from-[#8b5cf6] to-[#7c3aed]',
  },
]

function FeaturesSection() {
  return (
    <section id="features" className="bg-cream px-6 py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary">FEATURES</p>
          <h2 className="text-4xl font-bold text-espresso">
            Everything You Need to{' '}
            <span className="bg-gradient-badge bg-clip-text text-transparent">
              Excel
            </span>
          </h2>
          <p className="mt-4 text-warmgray">
            Powerful tools designed to make studying engaging, trackable, and rewarding.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.title}
                className="rounded-3xl border border-sand bg-surface p-6 shadow-warm transition duration-300 hover:-translate-y-1 hover:shadow-warm-lg"
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient}`}>
                  <Icon className="text-2xl text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-espresso">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-warmgray">{feature.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection