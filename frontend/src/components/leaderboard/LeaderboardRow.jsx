import { getAvatar } from '../../utils/avatars.js'

function getRankIcon(rank) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'

  return `#${rank}`
}

function LeaderboardRow({ entry, isCurrentUser = false }) {
  const rankIcon = getRankIcon(entry.rank)

  return (
    <div
      className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-primary/5 ${
        isCurrentUser ? 'border-l-4 border-primary bg-primary/10' : ''
      }`}
    >
      <div className="w-12 text-center text-warmgray font-semibold">{rankIcon}</div>

      <div className="flex w-12 items-center justify-center text-3xl">{getAvatar(entry.avatar)}</div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-espresso">{entry.username}</p>
          {isCurrentUser ? (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              YOU
            </span>
          ) : null}
        </div>
        <p className="text-xs text-warmgray">
          Level {entry.level} {entry.levelTitle}
        </p>
      </div>

      <div className="text-right">
        <p className="font-bold text-primary">{Number(entry.totalXP || 0).toLocaleString()}</p>
        <p className="text-xs text-warmgray">XP</p>
      </div>
    </div>
  )
}

export default LeaderboardRow