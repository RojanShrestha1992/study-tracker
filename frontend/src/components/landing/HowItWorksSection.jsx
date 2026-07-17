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
    <section id="how-it-works" className="border-t border-sand bg-cream px-6 py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-accent">HOW IT WORKS</p>
          <h2 className="text-4xl font-bold text-espresso">
            Start Your Journey in{' '}
            <span className="bg-gradient-badge bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>
          <p className="mt-4 text-warmgray">Getting started is easy. Be up and running in minutes.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col">
              <article className="rounded-3xl border border-sand bg-surface p-6 text-center shadow-warm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-badge font-bold text-white">
                  {step.number}
                </div>
                <div className="mb-3 text-3xl">{step.icon}</div>
                <h3 className="mb-2 text-lg font-bold text-espresso">{step.title}</h3>
                <p className="text-sm text-warmgray">{step.description}</p>
              </article>

              {index < steps.length - 1 ? (
                <div className="mx-auto my-4 hidden h-px w-20 border-t border-dashed border-sand lg:block" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-6 text-lg text-warmgray">Ready to transform your study habits?</p>
          <Link
            to="/register"
            className="mx-auto inline-block rounded-xl bg-primary px-10 py-4 text-lg font-bold text-white transition-transform hover:scale-105 shadow-warm"
          >
            Get Started for Free
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection