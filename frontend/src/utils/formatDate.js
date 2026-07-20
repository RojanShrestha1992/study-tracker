export function timeAgo(dateString) {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''

  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)

  if (diffSec < 60) return 'Just now'

  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} minutes ago`

  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours} hours ago`

  const diffDays = Math.floor(diffHours / 24)

  if (diffDays === 1) return 'Yesterday'
  if (diffDays >= 2 && diffDays <= 6) return `${diffDays} days ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

export function formatDuration(minutes) {
  const m = Number(minutes || 0)

  if (m < 60) return `${m} min`

  const h = Math.floor(m / 60)
  const remainder = m % 60

  if (remainder === 0) return `${h}h`
  return `${h}h ${remainder}m`
}

