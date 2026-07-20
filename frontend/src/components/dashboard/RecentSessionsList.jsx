import EmptyState from '../ui/EmptyState.jsx'
import { timeAgo } from '../../utils/formatDate.js'

function RecentSessionsList({ sessions }) {
  const safe = Array.isArray(sessions) ? sessions.slice(0, 5) : []

  return (
    <div className="rounded-2xl border border-sand bg-surface shadow-warm p-6">
      <h3 className="text-espresso font-semibold">🕐 Recent Sessions</h3>

      {safe.length === 0 ? (
        <div className="mt-4">
          <EmptyState icon="⏱️" title="No sessions yet. Start your first Pomodoro!" description="Your study history will show up here." />
        </div>
      ) : (
        <div className="mt-4">
          {safe.map((s) => {
            const subject = s.subjectId || s.subject
            return (
              <div key={s._id} className="flex items-center gap-3 border-b border-sand py-2 last:border-b-0">
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: subject?.color ? `${subject.color}1A` : undefined }}
                >
                  <span style={{ color: subject?.color || undefined, fontSize: 20 }}>{subject?.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-espresso font-medium">{subject?.name}</div>
                  <div className="text-warmgray text-xs">
                    {s.duration} min • {timeAgo(s.completedAt)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RecentSessionsList

