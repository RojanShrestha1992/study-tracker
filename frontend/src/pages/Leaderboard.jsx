import { useEffect, useMemo, useState } from 'react'
import api from '../utils/api.js'
import useToastStore from '../stores/toastStore.js'
import EmptyState from '../components/ui/EmptyState.jsx'
import Button from '../components/ui/Button.jsx'
import LeaderboardRow from '../components/leaderboard/LeaderboardRow.jsx'
import { getAvatar } from '../utils/avatars.js'
import { SkeletonGroup } from '../components/ui/SkeletonLoader.jsx'

const PAGE_SIZE = 20

function getMotivationalMessage(rank) {
  if (rank <= 10) {
    return "🔥 You're crushing it! Elite scholar tier."
  }

  if (rank <= 50) {
    return '📈 Great progress! Keep climbing the ranks.'
  }

  return '💪 Every session counts. Start studying to climb!'
}

function formatLevelTitle(levelTitle) {
  return levelTitle || 'Beginner'
}

function Leaderboard() {
  const addToast = useToastStore((state) => state.addToast)
  const [leaderboardData, setLeaderboardData] = useState(null)
  const [displayedUsers, setDisplayedUsers] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    let active = true

    async function loadLeaderboard() {
      try {
        setLoading(true)
        const { data } = await api.get('/api/leaderboard', {
          params: { skip: 0, limit: PAGE_SIZE },
        })

        if (!active) {
          return
        }

        const nextUsers = Array.isArray(data?.leaderboard) ? data.leaderboard : []
        setLeaderboardData(data)
        setDisplayedUsers(nextUsers)
        setTotalUsers(Number(data?.totalUsers || 0))
        setCurrentUser(data?.currentUser || null)
      } catch (error) {
        addToast(error.response?.data?.message || 'Unable to load leaderboard', 'error')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadLeaderboard()

    return () => {
      active = false
    }
  }, [addToast])

  const hasRankedUsers = useMemo(
    () => displayedUsers.some((entry) => Number(entry.totalXP || 0) > 0),
    [displayedUsers]
  )

  const podiumUsers = useMemo(() => displayedUsers.slice(0, 3), [displayedUsers])
  const responseTotalUsers = leaderboardData?.totalUsers ?? totalUsers

  const visibleUsers = displayedUsers

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true)
      const { data } = await api.get('/api/leaderboard', {
        params: { skip: displayedUsers.length, limit: PAGE_SIZE },
      })

      const nextUsers = Array.isArray(data?.leaderboard) ? data.leaderboard : []
      setLeaderboardData(data)
      setDisplayedUsers((currentUsers) => [...currentUsers, ...nextUsers])
      setTotalUsers(Number(data?.totalUsers || totalUsers))
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to load more users', 'error')
    } finally {
      setLoadingMore(false)
    }
  }

  const shouldShowLoadMore = displayedUsers.length < responseTotalUsers

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-espresso">👑 Leaderboard</h1>
        <p className="mt-2 text-warmgray">Top scholars ranked by total XP</p>
      </header>

      {loading ? (
        <div className="space-y-6">
          <SkeletonGroup count={1} variant="card" className="h-28 rounded-3xl" />
          <div className="rounded-3xl border border-sand bg-surface p-6 shadow-warm">
            <div className="grid gap-4 md:grid-cols-3">
              <SkeletonGroup count={3} variant="card" className="h-44" />
            </div>
          </div>
          <div className="space-y-2 rounded-3xl border border-sand bg-surface p-6 shadow-warm">
            <SkeletonGroup count={10} variant="list-item" />
          </div>
        </div>
      ) : (
        <>
          {currentUser && hasRankedUsers ? (
            <section className="rounded-3xl border-2 border-primary/30 bg-gradient-hero p-6 shadow-warm">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-warmgray">Your Rank</p>
                  <p className="mt-1 text-4xl font-bold text-espresso">#{currentUser.rank}</p>
                  <p className="text-sm text-warmgray">out of {totalUsers} scholars</p>
                </div>

                <div className="flex flex-1 items-center gap-4 md:ml-6">
                  <div className="text-3xl">{getAvatar(currentUser.avatar)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-semibold text-espresso">{currentUser.username}</p>
                    <p className="text-sm text-warmgray">
                      Level {currentUser.level} {formatLevelTitle(currentUser.levelTitle)}
                    </p>
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-3xl font-bold text-primary">{Number(currentUser.totalXP || 0).toLocaleString()}</p>
                  <p className="text-sm text-warmgray">Total XP</p>
                </div>
              </div>

              <p className="mt-4 text-center text-sm italic text-espresso">
                {getMotivationalMessage(currentUser.rank)}
              </p>
            </section>
          ) : null}

          {hasRankedUsers ? (
            <section className="rounded-3xl border border-sand bg-surface p-6 shadow-warm">
              <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-espresso">Top 20 Scholars</h2>
                  {responseTotalUsers > PAGE_SIZE ? (
                    <p className="text-sm text-warmgray">Showing top {displayedUsers.length} of {responseTotalUsers}</p>
                  ) : null}
                </div>
              </div>

              {podiumUsers.length >= 3 ? (
                <div className="mt-6 rounded-3xl border border-sand bg-surface p-6 shadow-warm">
                  <div className="grid items-end gap-4 md:grid-cols-3">
                    {[
                      { entry: podiumUsers[1], order: 2, height: 'h-24', gradient: 'bg-gradient-to-t from-gray-400 to-gray-300', medal: '🥈' },
                      { entry: podiumUsers[0], order: 1, height: 'h-32', gradient: 'bg-gradient-to-t from-status-xp to-game-coins', medal: '🥇' },
                      { entry: podiumUsers[2], order: 3, height: 'h-20', gradient: 'bg-gradient-to-t from-secondary to-orange-400', medal: '🥉' },
                    ].map(({ entry, order, height, gradient, medal }) => (
                      <div key={order} className="text-center">
                        <div className="mb-2 text-5xl">{getAvatar(entry.avatar)}</div>
                        <p className="truncate font-semibold text-espresso">{entry.username}</p>
                        <p className="text-xs text-warmgray">
                          Level {entry.level} {entry.levelTitle}
                        </p>
                        <p className="font-bold text-primary">{Number(entry.totalXP || 0).toLocaleString()} XP</p>
                        <div className={`mt-4 flex ${height} flex-col items-center justify-end rounded-t-2xl ${gradient} px-3 py-4 text-white`}>
                          <div className="text-4xl">{medal}</div>
                          <div className="mt-2 text-2xl font-bold">{order}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-6 space-y-2">
                {visibleUsers.map((entry) => (
                  <LeaderboardRow
                    key={`${entry.userId}-${entry.rank}`}
                    entry={entry}
                    isCurrentUser={currentUser?.userId === entry.userId}
                  />
                ))}
              </div>

              {!hasRankedUsers ? (
                <div className="mt-6">
                  <EmptyState
                    icon="🏆"
                    title="Leaderboard is empty"
                    description="Be the first! Complete a study session to appear here."
                  />
                </div>
              ) : null}

              {shouldShowLoadMore ? (
                <div className="mt-6 flex justify-center">
                  <Button variant="primary" onClick={handleLoadMore} disabled={loadingMore}>
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              ) : null}
            </section>
          ) : (
            <EmptyState
              icon="🏆"
              title="Leaderboard is empty"
              description="Be the first! Complete a study session to appear here."
            />
          )}
        </>
      )}
    </div>
  )
}

export default Leaderboard