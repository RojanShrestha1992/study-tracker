import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api.js'
import useToastStore from '../stores/toastStore.js'
import useUserStore from '../stores/userStore.js'
import { getGreeting, getMotivationalMessage } from '../utils/greetings.js'
import StatCard from '../components/dashboard/StatCard.jsx'
import WeeklyChart from '../components/dashboard/WeeklyChart.jsx'
import RecentBadgesPanel from '../components/dashboard/RecentBadgesPanel.jsx'
import TodayTasksList from '../components/dashboard/TodayTasksList.jsx'
import RecentSessionsList from '../components/dashboard/RecentSessionsList.jsx'
import Button from '../components/ui/Button.jsx'

function Dashboard() {
  const navigate = useNavigate()
  const addToast = useToastStore((state) => state.addToast)
  const fetchUser = useUserStore((state) => state.fetchUser)

  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  const greeting = useMemo(() => getGreeting(), [])
  const user = useUserStore((state) => state.user)

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/api/dashboard')
      setDashboard(data?.data || null)
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to load dashboard', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    (async () => {
      await loadDashboard()
    })()
  }, [])

  const levelInfo = user?.levelInfo || {
    level: 1,
    title: 'Student',
    currentLevelXP: 0,
    nextLevelXP: 500,
    progress: 0,
    xpNeededForNext: 500,
  }

  const todaySessionsCount = dashboard?.todaySessionsCount || 0
  const todayStudyMinutes = dashboard?.todayStudyMinutes || 0

  const weeklyStudyData = dashboard?.weeklyStudyData || []
  const recentBadges = dashboard?.recentBadges || []
  const todayTasks = dashboard?.todayTasks || []
  const recentSessions = dashboard?.recentSessions || []

  const handleQuickComplete = async (taskId) => {
    try {
      await api.put(`/api/tasks/${taskId}/complete`)
      await fetchUser()
      await loadDashboard()
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to complete task', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-sand bg-gradient-hero p-8 shadow-warm">
        <div className="grid gap-6 md:grid-cols-[1.3fr_0.7fr] md:items-center">
          <div>
            <div className="text-espresso text-3xl font-bold">
              {greeting.text}, {user?.name || 'Student'}! {greeting.emoji}
            </div>
            <div className="mt-2 text-warmgray text-base">
              {getMotivationalMessage(user?.currentStreak || 0, todaySessionsCount)}
            </div>
          </div>

          <div className="flex items-center justify-start md:justify-end">
            <Button size="lg" onClick={() => navigate('/timer')}>
              ▶ Start Pomodoro
            </Button>
          </div>
        </div>
      </div>

      {loading || !dashboard ? (
        <div className="text-warmgray">Loading...</div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="LEVEL"
              value={`Lv ${levelInfo.level}`}
              icon="🎯"
              accentColor="text-primary"
              subtitle={levelInfo.title}
            >
              <div className="w-full">
                <div className="w-full h-2 bg-sand rounded-full mt-3">
                  <div
                    className="h-full bg-gradient-xp rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, Number(levelInfo.progress || 0)))}%` }}
                  />
                </div>
                <div className="mt-1 text-warmgray text-xs">
                  {levelInfo.currentLevelXP} / {levelInfo.nextLevelXP} XP
                </div>
              </div>
            </StatCard>

            <StatCard
              label="STREAK"
              value={`${user?.currentStreak || 0} days`}
              icon="🔥"
              accentColor="text-game-fire"
              subtitle={`Longest: ${user?.longestStreak || 0} days`}
            />

            <StatCard
              label="TOTAL XP"
              value={`${Number(user?.totalXP || 0).toLocaleString()}`}
              icon="⚡"
              accentColor="text-game-xp"
              subtitle="All-time earnings"
            />

            <StatCard
              label="TODAY"
              value={`${todaySessionsCount}`}
              icon="⏱️"
              accentColor="text-accent"
              subtitle={`${todayStudyMinutes} min studied`}
            />
          </section>

          <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="lg:col-span-2">
              <WeeklyChart data={weeklyStudyData} />
            </div>
            
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <RecentBadgesPanel badges={recentBadges} />
            </div>
            <div>
              <TodayTasksList tasks={todayTasks} onComplete={handleQuickComplete} />
            </div>
            <div>
              <RecentSessionsList sessions={recentSessions} />
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default Dashboard

