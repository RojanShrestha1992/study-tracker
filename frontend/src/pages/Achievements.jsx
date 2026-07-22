import { useEffect, useMemo, useState } from 'react'
import api from '../utils/api.js'
import useToastStore from '../stores/toastStore.js'
import EmptyState from '../components/ui/EmptyState.jsx'
import BadgeCard from '../components/achievements/BadgeCard.jsx'
import BadgeDetailModal from '../components/achievements/BadgeDetailModal.jsx'
import { SkeletonGroup } from '../components/ui/SkeletonLoader.jsx'

const CATEGORY_ORDER = [
  { key: 'streak', label: '🔥 Streak Badges' },
  { key: 'session', label: '⏱️ Session Badges' },
  { key: 'time', label: '📚 Study Time Badges' },
  { key: 'task', label: '✅ Task Badges' },
  { key: 'special', label: '⭐ Special Badges' },
]

function Achievements() {
  const addToast = useToastStore((state) => state.addToast)
  const [badges, setBadges] = useState([])
  const [filter, setFilter] = useState('all')
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadBadges() {
      try {
        setLoading(true)
        const { data } = await api.get('/api/badges/me')

        if (active) {
          setBadges(Array.isArray(data?.badges) ? data.badges : [])
        }
      } catch (error) {
        addToast(error.response?.data?.message || 'Unable to load badges', 'error')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadBadges()

    return () => {
      active = false
    }
  }, [addToast])

  const unlockedCount = useMemo(() => badges.filter((badge) => badge.unlocked).length, [badges])
  const totalBadges = badges.length
  const completion = totalBadges > 0 ? Math.round((unlockedCount / totalBadges) * 100) : 0

  const groupedBadges = useMemo(() => {
    const filtered = badges.filter((badgeData) => {
      if (filter === 'unlocked') return badgeData.unlocked
      if (filter === 'locked') return !badgeData.unlocked
      return true
    })

    return CATEGORY_ORDER.map((category) => ({
      ...category,
      items: filtered.filter((badgeData) => badgeData.badge?.category === category.key),
    })).filter((group) => group.items.length > 0)
  }, [badges, filter])

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'unlocked', label: `Unlocked (${unlockedCount})` },
    { key: 'locked', label: `Locked (${Math.max(0, totalBadges - unlockedCount)})` },
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-espresso">🏆 Achievements</h1>
        <p className="mt-2 text-warmgray">Unlock badges by reaching study milestones</p>
      </header>

      <section className="rounded-3xl border border-primary/20 bg-gradient-hero p-6 shadow-warm">
        <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="text-sm text-warmgray">Total Progress</p>
            <p className="mt-2 text-2xl font-bold text-espresso">
              {unlockedCount} / {totalBadges} badges unlocked
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm text-warmgray">
              <span>Completion</span>
              <span>{completion}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-sand">
              <div className="h-full rounded-full bg-gradient-badge" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-4 border-b border-sand">
        {filterTabs.map((tab) => {
          const active = filter === tab.key

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`-mb-[1px] border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
                active
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-transparent text-warmgray hover:text-espresso'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="space-y-6">
          <SkeletonGroup count={1} variant="card" className="h-24 rounded-3xl" />
          <div className="grid grid-cols-3 gap-4">
            <SkeletonGroup count={3} variant="stat" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <SkeletonGroup count={12} variant="card" className="h-40" />
          </div>
        </div>
      ) : groupedBadges.length === 0 ? (
        <EmptyState
          icon="🏆"
          title="No badges to show"
          description="Try a different filter or complete more study milestones."
        />
      ) : (
        <div className="space-y-8">
          {groupedBadges.map((group) => (
            <section key={group.key}>
              <h2 className="mb-4 text-lg font-semibold text-espresso">{group.label}</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {group.items.map((badgeData) => (
                  <BadgeCard key={badgeData.badge?.key} badgeData={badgeData} onClick={() => setSelectedBadge(badgeData)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <BadgeDetailModal
        badgeData={selectedBadge}
        isOpen={Boolean(selectedBadge)}
        onClose={() => setSelectedBadge(null)}
      />
    </div>
  )
}

export default Achievements