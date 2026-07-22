import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api.js'
import useToastStore from '../stores/toastStore.js'
import useUserStore from '../stores/userStore.js'
import { formatDuration } from '../utils/formatDate.js'
import { getAvatar } from '../utils/avatars.js'
import StatCard from '../components/dashboard/StatCard.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import SkeletonLoader, { SkeletonGroup } from '../components/ui/SkeletonLoader.jsx'
import EditableUsername from '../components/profile/EditableUsername.jsx'
import AvatarModal from '../components/profile/AvatarModal.jsx'

function formatMemberSince(dateString) {
  if (!dateString) return 'Recently joined'

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Recently joined'

  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

function Profile() {
  const addToast = useToastStore((state) => state.addToast)
  const fetchUser = useUserStore((state) => state.fetchUser)
  const user = useUserStore((state) => state.user)

  const [stats, setStats] = useState(null)
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [avatarOpen, setAvatarOpen] = useState(false)

  useEffect(() => {
    let active = true

    async function loadProfile() {
      try {
        setLoading(true)
        const [statsResponse, badgesResponse] = await Promise.all([
          api.get('/api/user/me/stats'),
          api.get('/api/badges/me'),
        ])

        if (!active) return

        setStats(statsResponse.data)
        setBadges(Array.isArray(badgesResponse.data?.badges) ? badgesResponse.data.badges : [])
      } catch (error) {
        addToast(error.response?.data?.message || 'Unable to load profile', 'error')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      active = false
    }
  }, [addToast])

  const levelInfo = user?.levelInfo || {
    currentLevelXP: 0,
    nextLevelXP: 500,
    progress: 0,
    level: 1,
    title: 'Student',
  }

  const unlockedBadges = useMemo(() => badges.filter((badge) => badge.unlocked), [badges])
  const totalBadges = stats?.totalBadgesMasterList || badges.length
  const visibleBadges = unlockedBadges.slice(0, 12)
  const remainingBadges = Math.max(0, unlockedBadges.length - visibleBadges.length)

  const handleUsernameUpdate = async () => {
    await fetchUser()
  }

  const totalMinutes = Number(stats?.totalStudyTime || 0)

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-primary/20 bg-gradient-hero p-8 shadow-warm">
        {loading ? (
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <SkeletonLoader variant="circle" className="h-32 w-32" />
            <div className="flex-1 space-y-4">
              <SkeletonLoader variant="text" className="h-10 w-56" />
              <SkeletonLoader variant="text" className="h-5 w-80" />
              <SkeletonLoader variant="card" className="h-3 w-full" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <button
              type="button"
              onClick={() => setAvatarOpen(true)}
              className="group relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-badge text-6xl shadow-warm-lg"
            >
              <span>{getAvatar(user?.avatar)}</span>
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-espresso/60 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                📷 Change
              </span>
            </button>

            <div className="flex-1 text-center md:text-left">
              <EditableUsername username={user?.name || 'Student'} onUpdate={handleUsernameUpdate} />

              <div className="mt-3 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <div className="text-lg font-semibold text-primary">
                  Level {levelInfo.level} {levelInfo.title}
                </div>
                <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
                  🎯 Scholar
                </span>
              </div>

              <p className="mt-2 text-sm text-warmgray">Member since {formatMemberSince(user?.createdAt)}</p>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs text-warmgray">
                  <span>XP Progress</span>
                  <span>{levelInfo.currentLevelXP} / {levelInfo.nextLevelXP} XP</span>
                </div>
                <div className="h-3 rounded-full bg-sand">
                  <div className="h-3 rounded-full bg-gradient-xp" style={{ width: `${Math.min(100, Math.max(0, Number(levelInfo.progress || 0)))}%` }} />
                </div>
                <p className="mt-2 text-sm text-warmgray">
                  {levelInfo.currentLevelXP} / {levelInfo.nextLevelXP} XP
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {loading ? (
          <SkeletonGroup count={6} variant="stat" />
        ) : (
          <>
            <StatCard label="TOTAL TIME" value={formatDuration(totalMinutes)} icon="📚" accentColor="text-primary" />
            <StatCard label="SESSIONS" value={Number(stats?.totalSessions || 0).toLocaleString()} icon="⏱️" accentColor="text-accent" />
            <StatCard label="TASKS" value={Number(stats?.totalTasksCompleted || 0).toLocaleString()} icon="✅" accentColor="text-status-completed" />
            <StatCard label="STREAK" value={`${user?.currentStreak || 0} days`} icon="🔥" accentColor="text-game-fire" subtitle={`Longest: ${user?.longestStreak || 0}`} />
            <StatCard label="BADGES" value={`${unlockedBadges.length} / ${totalBadges}`} icon="🏆" accentColor="text-primary" />
            <StatCard label="TOTAL XP" value={Number(user?.totalXP || 0).toLocaleString()} icon="⚡" accentColor="text-game-xp" />
          </>
        )}
      </section>

      <section className="rounded-2xl border border-sand bg-surface p-6 shadow-warm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-espresso">🏆 Trophy Case</h2>
          <Link to="/achievements" className="text-sm font-semibold text-primary hover:underline">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8">
            <SkeletonGroup count={12} variant="card" className="h-24" />
          </div>
        ) : visibleBadges.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon="🏆"
              title="No badges yet"
              description="Complete sessions to earn your first!"
            />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8">
            {visibleBadges.map((badgeData) => (
              <div key={badgeData.badge?.key} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-badge shadow-warm">
                  <span className="text-2xl text-white">{badgeData.badge?.icon}</span>
                </div>
                <p className="mt-2 truncate text-xs text-espresso">{badgeData.badge?.name}</p>
              </div>
            ))}

            {remainingBadges > 0 ? (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-sand bg-cream text-sm font-semibold text-warmgray shadow-warm">
                  +{remainingBadges} more
                </div>
              </div>
            ) : null}
          </div>
        )}
      </section>

      <AvatarModal
        isOpen={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        currentAvatar={user?.avatar}
        onUpdate={() => fetchUser()}
      />
    </div>
  )
}

export default Profile