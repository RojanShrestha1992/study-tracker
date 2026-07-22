import { useEffect, useMemo, useState } from 'react'
import api from '../utils/api.js'
import useToastStore from '../stores/toastStore.js'
import useUserStore from '../stores/userStore.js'
import EmptyState from '../components/ui/EmptyState.jsx'
import TaskCard from '../components/tasks/TaskCard.jsx'
import AddTaskModal from '../components/tasks/AddTaskModal.jsx'
import Button from '../components/ui/Button.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import { SkeletonGroup } from '../components/ui/SkeletonLoader.jsx'

function Tasks() {
  const addToast = useToastStore((state) => state.addToast)
  const fetchUser = useUserStore((state) => state.fetchUser)

  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [taskToDelete, setTaskToDelete] = useState(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/api/tasks')
      const list = data.tasks || []

      const pending = list.filter((t) => t.status !== 'completed')
      const completed = list.filter((t) => t.status === 'completed')

      pending.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      completed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setTasks([...pending, ...completed])
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to load tasks', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const visible = useMemo(() => {
    if (filter === 'pending') return tasks.filter((t) => t.status !== 'completed')
    if (filter === 'completed') return tasks.filter((t) => t.status === 'completed')
    return tasks
  }, [tasks, filter])

  const pendingCount = tasks.filter((t) => t.status !== 'completed').length
  const completedCount = tasks.filter((t) => t.status === 'completed').length

  const handleCreateSuccess = () => {
    fetchTasks()
  }

  const handleComplete = async (taskId) => {
    try {
      const { data } = await api.put(`/api/tasks/${taskId}/complete`)
      addToast(`+${data.xpEarned} XP earned!`, 'success')

      if (data.leveledUp) {
        addToast(`🎉 Level Up! Now Level ${data.newLevel}`, 'info')
      }

      if (Array.isArray(data.newlyUnlockedBadges) && data.newlyUnlockedBadges.length) {
        for (const b of data.newlyUnlockedBadges) {
          addToast(`🏆 ${b.name} unlocked!`, 'badge')
        }
      }

      await fetchUser()
      await fetchTasks()
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to complete task', 'error')
    }
  }

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/api/tasks/${taskId}`)
      addToast('Task deleted', 'info')
      setTaskToDelete(null)
      await fetchTasks()
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to delete task', 'error')
    }
  }

  const hasAny = tasks.length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-espresso text-3xl font-bold">✅ My Tasks</h1>
          <p className="mt-1 text-warmgray">Complete tasks to earn XP and unlock badges.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Add Task</Button>
      </div>

      <div className="flex items-center gap-4 border-b border-sand">
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'completed', label: 'Completed' },
        ].map((t) => {
          const active = filter === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setFilter(t.key)}
              className={`-mb-[1px] border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
                active
                  ? 'border-primary/100 bg-primary/10 text-primary'
                  : 'border-transparent text-warmgray hover:text-espresso'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="space-y-3 rounded-3xl border border-sand bg-surface p-6 shadow-warm">
          <SkeletonGroup count={5} variant="list-item" />
        </div>
      ) : !hasAny ? (
        <EmptyState
          icon="✅"
          title="No tasks yet"
          description="Create your first task to start earning XP!"
         
        />
      ) : (
        <div className="space-y-6">
          {filter === 'all' ? (
            <>
              <section>
                <div className="flex items-center justify-between">
                  <div className="text-warmgray text-sm font-semibold uppercase tracking-wide">
                    Pending ({pendingCount})
                  </div>
                </div>

                <div className="mt-3 space-y-3">
                  {tasks
                    .filter((t) => t.status !== 'completed')
                    .map((task) => (
                      <TaskCard key={task._id} task={task} onComplete={handleComplete} onDelete={setTaskToDelete} />
                    ))}

                  {pendingCount === 0 ? (
                    <div className="rounded-2xl border border-sand bg-surface p-5 text-center text-warmgray shadow-warm">No pending tasks</div>
                  ) : null}
                </div>
              </section>

              <section>
                <div className="text-warmgray text-sm font-semibold uppercase tracking-wide">Completed ({completedCount})</div>

                <div className="mt-3 space-y-3">
                  {tasks
                    .filter((t) => t.status === 'completed')
                    .map((task) => (
                      <TaskCard key={task._id} task={task} onComplete={handleComplete} onDelete={setTaskToDelete} />
                    ))}

                  {completedCount === 0 ? (
                    <div className="rounded-2xl border border-sand bg-surface p-5 text-center text-warmgray shadow-warm">No completed tasks</div>
                  ) : null}
                </div>
              </section>
            </>
          ) : (
            <section>
              <div className="text-warmgray text-sm font-semibold uppercase tracking-wide">
                {filter === 'pending' ? 'Pending' : 'Completed'} ({visible.length})
              </div>

              <div className="mt-3 space-y-3">
                {visible.map((task) => (
                  <TaskCard key={task._id} task={task} onComplete={handleComplete} onDelete={setTaskToDelete} />
                ))}

                {visible.length === 0 ? (
                  <div className="rounded-2xl border border-sand bg-surface p-5 text-center text-warmgray shadow-warm">No {filter} tasks</div>
                ) : null}
              </div>
            </section>
          )}
        </div>
      )}


        <ConfirmDialog
          isOpen={Boolean(taskToDelete)}
          onClose={() => setTaskToDelete(null)}
          title="Delete Task"
          message="Are you sure you want to delete this task?"
          confirmText="Delete"
          confirmVariant="danger"
          onConfirm={() => handleDelete(taskToDelete)}
        />
      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleCreateSuccess} />
    </div>
  )
}

export default Tasks

