import EmptyState from '../ui/EmptyState.jsx'
import { Link } from 'react-router-dom'

function RecentBadgesPanel({ badges }) {
  const safe = Array.isArray(badges) ? badges.slice(0, 4) : []

  return (
    <div className="rounded-2xl border border-sand bg-surface shadow-warm p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-espresso font-semibold">🏆 Recent Badges</h3>
        <Link to="/achievements" className="text-primary text-sm hover:underline">
          View All →
        </Link>
      </div>

      {safe.length === 0 ? (
        <div className="mt-4">
          <EmptyState icon="🏆" title="No badges yet" description="Complete sessions and tasks to unlock your first badge." />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {safe.map((b) => (
            <div key={b.key || b._id || b.name} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-badge">
                <div className="text-2xl text-white">{b.icon}</div>
              </div>
              <div className="mt-2 truncate text-xs text-espresso">{b.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecentBadgesPanel

