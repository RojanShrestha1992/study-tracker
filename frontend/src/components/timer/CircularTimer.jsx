function CircularTimer({ timeLeft, totalTime, mode }) {
  const radius = 110
  const circumference = 2 * Math.PI * radius
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * circumference : 0
  const offset = circumference - progress

  const colorMap = {
    focus: '#8B5CF6',
    shortBreak: '#10B981',
    longBreak: '#3B82F6',
  }

  const formatTime = (value) => {
    const minutes = Math.floor(value / 60)
    const seconds = value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center justify-center">
      <svg width="280" height="280" viewBox="0 0 280 280" className="drop-shadow-2xl">
        <circle cx="140" cy="140" r={radius} stroke="rgba(255,255,255,0.12)" strokeWidth="12" fill="none" />
        <circle
          cx="140"
          cy="140"
          r={radius}
          stroke={colorMap[mode] || colorMap.focus}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 140 140)"
          style={{ transition: 'stroke-dashoffset 0.5s linear' }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-6xl font-bold text-white">{formatTime(timeLeft)}</p>
        <p className="mt-3 text-sm uppercase tracking-[0.25em] text-gray-400">{mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short break' : 'Long break'}</p>
      </div>
    </div>
  )
}

export default CircularTimer
