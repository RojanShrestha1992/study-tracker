import { Link } from 'react-router-dom'
function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      icon: '📝',
      title: 'Create Your Account',
      description: 'Sign up for free and set up your student profile in under a minute.',
    },
    {
      number: '2',
      icon: '📚',
      title: 'Add Your Subjects',
      description: 'Add the subjects you are studying and create tasks to break your work into goals.',
    },
    {
      number: '3',
      icon: '⏱️',
      title: 'Start Studying',
      description: 'Use the Pomodoro timer or log sessions manually. Every minute earns you XP.',
    },
    {
      number: '4',
      icon: '🏆',
      title: 'Earn Rewards',
      description: 'Level up, unlock badges, climb the leaderboard, and customize your profile.',
    },
  ]

  return (
    <section id="how-it-works" className="border-t border-[#2d2d44] bg-[#0f0f1a] px-6 py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-[#06b6d4]">HOW IT WORKS</p>
          <h2 className="text-4xl font-bold text-white">
            Start Your Journey in{' '}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>
          <p className="mt-4 text-[#94a3b8]">Getting started is easy. Be up and running in minutes.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col">
              <article className="rounded-2xl border border-[#2d2d44] bg-[#1a1a2e] p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] font-bold text-white">
                  {step.number}
                </div>
                <div className="mb-3 text-3xl">{step.icon}</div>
                <h3 className="mb-2 text-lg font-bold text-white">{step.title}</h3>
                <p className="text-sm text-[#94a3b8]">{step.description}</p>
              </article>

              {index < steps.length - 1 ? (
                <div className="mx-auto my-4 hidden h-px w-20 border-t border-dashed border-[#2d2d44] lg:block" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-6 text-lg text-[#94a3b8]">Ready to transform your study habits?</p>
          <Link
            to="/register"
            className="mx-auto inline-block rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-10 py-4 text-lg font-bold text-white transition-transform hover:scale-105"
          >
            Get Started for Free
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection