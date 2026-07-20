import { ResponsiveContainer, BarChart, Bar, XAxis, CartesianGrid, Tooltip } from 'recharts'
import EmptyState from '../ui/EmptyState.jsx'

function WarmTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  const item = payload[0]?.payload
  return (
    <div className="rounded-lg bg-espresso p-2 text-xs text-white shadow-warm">
      {item?.day}: {item?.minutes} min
    </div>
  )
}

function WeeklyChart({ data }) {
  const safeData = Array.isArray(data) ? data : []
  const allZero = safeData.every((d) => Number(d.minutes || 0) === 0)

  const totalWeekMinutes = safeData.reduce((sum, d) => sum + Number(d.minutes || 0), 0)

  if (allZero) {
    return (
      <EmptyState
        icon="📈"
        title="No study time this week yet — let's fix that! 💪"
        description="Start a Pomodoro and watch your chart light up."
      />
    )
  }

  return (
    <div className="rounded-2xl border border-sand bg-surface shadow-warm p-6">
      <div>
        <h3 className="text-espresso font-semibold">📈 This Week's Study Time</h3>
        <p className="mt-1 text-warmgray text-sm">{totalWeekMinutes} min this week</p>
      </div>

      <div className="mt-4">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={safeData}>
            <CartesianGrid stroke="#E7DCCF" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#7C6A5D', fontSize: 12 }}
            />
            <Tooltip content={<WarmTooltip />} />
            <Bar dataKey="minutes" fill="#D97706" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default WeeklyChart

