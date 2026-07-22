import Button from '../ui/Button.jsx'
import Modal from '../ui/Modal.jsx'

function formatFullDate(dateString) {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function BadgeDetailModal({ badgeData, isOpen, onClose }) {
  if (!badgeData) {
    return null
  }

  const badge = badgeData.badge || {}
  const unlocked = Boolean(badgeData.unlocked)
  const progress = badgeData.progress || { current: 0, target: 0 }
  const progressPercent = progress.target > 0 ? Math.min(100, Math.max(0, (progress.current / progress.target) * 100)) : 0
  const categoryLabel = badge.category ? badge.category.charAt(0).toUpperCase() + badge.category.slice(1) : 'Badge'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={badge.name || 'Badge'}>
      <div className="text-center">
        {unlocked ? (
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-badge shadow-warm-lg">
            <span className="text-5xl text-white">{badge.icon}</span>
          </div>
        ) : (
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-status-locked/30 bg-status-locked/20">
            <span className="text-5xl opacity-40 grayscale">{badge.icon}</span>
          </div>
        )}

        <p className="mt-4 text-espresso">{badge.description}</p>

        <div className="mt-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
          Category: {categoryLabel}
        </div>

        {unlocked ? (
          <div className="mt-5 rounded-xl border border-status-completed/30 bg-status-completed/10 p-4">
            <p className="font-medium text-espresso">
              ✓ Unlocked on {formatFullDate(badgeData.unlockedAt)}
            </p>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-sand bg-cream p-4 text-left">
            <p className="font-medium text-espresso">
              Progress: {progress.current} / {progress.target}
            </p>
            <div className="mt-3 h-2 w-full rounded-full bg-sand">
              <div className="h-full rounded-full bg-gradient-xp" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-2 text-sm text-warmgray">{Math.round(progressPercent)}%</p>
          </div>
        )}

        <div className="mt-6">
          <Button variant="primary" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default BadgeDetailModal