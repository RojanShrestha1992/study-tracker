import { timeAgo } from '../../utils/formatDate.js'

function formatProgressValue(progress) {
  if (!progress) return 0

  const target = Number(progress.target || 0)
  const current = Number(progress.current || 0)

  if (!target) return 0

  return Math.min(100, Math.max(0, (current / target) * 100))
}

function BadgeCard({ badgeData, onClick }) {
  const badge = badgeData?.badge || {}
  const unlocked = Boolean(badgeData?.unlocked)
  const progress = badgeData?.progress || { current: 0, target: 0 }
  const unlockedAt = badgeData?.unlockedAt
  const progressPercent = formatProgressValue(progress)

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-full w-full flex-col rounded-2xl border border-sand bg-surface p-4 text-left transition-all hover:-translate-y-1 hover:shadow-warm-lg"
    >
      {unlocked ? (
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-badge shadow-warm-lg">
          <span className="text-3xl text-white">{badge.icon}</span>
        </div>
      ) : (
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-status-locked/30 bg-status-locked/20">
          <span className="text-3xl opacity-40 grayscale">{badge.icon}</span>
          <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-surface text-[10px] shadow-warm">
            🔒
          </span>
        </div>
      )}

      <h3 className={`mt-3 text-center text-sm font-semibold ${unlocked ? 'text-espresso' : 'text-espresso/60'}`}>
        {badge.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-center text-xs text-warmgray">{badge.description}</p>

      {unlocked ? (
        <p className="mt-2 text-center text-xs text-primary">
          {unlockedAt ? `Unlocked ${timeAgo(unlockedAt)}` : 'Unlocked'}
        </p>
      ) : (
        <div className="mt-2">
          <div className="h-1.5 w-full rounded-full bg-sand">
            <div className="h-full rounded-full bg-gradient-xp" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="mt-1 text-center text-xs text-warmgray">
            {progress.current} / {progress.target}
          </p>
        </div>
      )}
    </button>
  )
}

export default BadgeCard