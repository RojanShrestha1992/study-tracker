import { useEffect } from 'react'

function XPPopup({ data, onClose }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 4000)
    return () => window.clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-badge p-8 text-center text-white shadow-2xl">
        <p className="text-5xl font-bold">+{data.xpEarned} XP</p>
        {data.bonusXP > 0 && <p className="mt-3 text-sm text-amber-50">Includes +{data.bonusXP} bonus 🎉</p>}
        <p className="mt-4 text-lg">Great work! Keep it up 🔥</p>
        {data.leveledUp && (
          <div className="mt-4 rounded-2xl bg-amber-100/20 p-3 text-sm text-amber-50">
            🎉 LEVEL UP! Now Level {data.newLevel} {data.newLevelTitle}
          </div>
        )}
        <button type="button" onClick={onClose} className="mt-6 rounded-xl bg-white/20 px-4 py-2 font-semibold text-white hover:bg-white/30">
          Continue
        </button>
      </div>
    </div>
  )
}

export default XPPopup
