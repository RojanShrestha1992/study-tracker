import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import CircularTimer from '../components/timer/CircularTimer.jsx'
import XPPopup from '../components/timer/XPPopup.jsx'
import useTimerStore from '../stores/timerStore.js'
import useToastStore from '../stores/toastStore.js'
import useUserStore from '../stores/userStore.js'
import api from '../utils/api.js'

function PomodoroTimer() {
  const navigate = useNavigate()
  const addToast = useToastStore((state) => state.addToast)
  const fetchUser = useUserStore((state) => state.fetchUser)
  const user = useUserStore((state) => state.user)

  const mode = useTimerStore((state) => state.mode)
  const timeLeft = useTimerStore((state) => state.timeLeft)
  const isRunning = useTimerStore((state) => state.isRunning)
  const sessionCount = useTimerStore((state) => state.sessionCount)
  const selectedSubjectId = useTimerStore((state) => state.selectedSubjectId)
  const selectedTaskId = useTimerStore((state) => state.selectedTaskId)
  const start = useTimerStore((state) => state.start)
  const pause = useTimerStore((state) => state.pause)
  const reset = useTimerStore((state) => state.reset)
  const skip = useTimerStore((state) => state.skip)
  const tick = useTimerStore((state) => state.tick)
  const setSubject = useTimerStore((state) => state.setSubject)
  const setTask = useTimerStore((state) => state.setTask)
  const switchMode = useTimerStore((state) => state.switchMode)
  const initTimer = useTimerStore((state) => state.initTimer)

  const [subjects, setSubjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [popupData, setPopupData] = useState(null)

  const totalTime = useMemo(() => {
    if (mode === 'shortBreak') return (user?.settings?.shortBreak || 5) * 60
    if (mode === 'longBreak') return (user?.settings?.longBreak || 15) * 60
    return (user?.settings?.workDuration || 25) * 60
  }, [mode, user])

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const { data } = await api.get('/api/subjects')
        setSubjects(data.subjects || [])
      } catch {
        addToast('Unable to load subjects', 'error')
      }
    }

    loadSubjects()
  }, [addToast])

  useEffect(() => {
    if (user?.settings) {
      initTimer(user.settings)
      setLoading(false)
    }
  }, [user, initTimer])

  useEffect(() => {
    if (!selectedSubjectId) return

    const loadTasks = async () => {
      try {
        const { data } = await api.get(`/api/tasks?subjectId=${selectedSubjectId}&status=pending`)
        setTasks(data.tasks || [])
      } catch {
        addToast('Unable to load tasks', 'error')
      }
    }

    loadTasks()
  }, [selectedSubjectId, addToast])

  useEffect(() => {
    if (!isRunning) return

    const interval = window.setInterval(() => tick(), 1000)
    return () => window.clearInterval(interval)
  }, [isRunning, tick])

  useEffect(() => {
    if (timeLeft !== 0) return

    const finishSession = async () => {
      if (mode === 'focus' && user?.settings) {
        try {
          const { data } = await api.post('/api/sessions', {
            subjectId: selectedSubjectId,
            taskId: selectedTaskId || null,
            duration: user.settings.workDuration,
          })

          setPopupData(data)
          addToast(`+${data.xpEarned} XP earned`, 'badge')
          await fetchUser()

          const nextMode = sessionCount === user.settings.sessionsBeforeLongBreak ? 'longBreak' : 'shortBreak'
          const nextSessionCount = sessionCount === user.settings.sessionsBeforeLongBreak ? 1 : sessionCount + 1
          switchMode(nextMode, user.settings)
          useTimerStore.setState({ sessionCount: nextSessionCount })
          pause()
        } catch (error) {
          addToast(error.response?.data?.message || 'Unable to save session', 'error')
        }
      } else {
        switchMode('focus', user?.settings || { workDuration: 25, shortBreak: 5, longBreak: 15 })
        pause()
      }
    }

    finishSession()
  }, [timeLeft, mode, user, selectedSubjectId, selectedTaskId, sessionCount, addToast, fetchUser, switchMode, pause])

  const handleStart = () => {
    if (!selectedSubjectId) {
      addToast('Select a subject first', 'error')
      return
    }

    start()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">⏱️ Pomodoro Timer</h1>
            <p className="mt-1 text-gray-400">Stay in flow and track your progress.</p>
          </div>
          <div className={`rounded-full px-3 py-1 text-sm font-medium ${mode === 'focus' ? 'bg-purple-500/20 text-purple-400' : mode === 'shortBreak' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </div>
        </div>
      </div>

      {!loading && subjects.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-10 text-center">
          <p className="text-gray-400">Add a subject first to begin tracking your sessions.</p>
          <Button className="mt-4" onClick={() => navigate('/subjects')}>Go to Subjects</Button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-6">
            <div className="relative flex items-center justify-center">
              <CircularTimer timeLeft={timeLeft} totalTime={totalTime} mode={mode} />
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">Session {sessionCount} of 4</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {!isRunning ? (
                  <Button onClick={handleStart} disabled={!selectedSubjectId}>Start</Button>
                ) : (
                  <Button variant="secondary" onClick={pause}>Pause</Button>
                )}
                <Button variant="ghost" onClick={reset}>Reset</Button>
                <Button variant="ghost" onClick={() => { skip(); pause(); }} >Skip</Button>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-gray-800 bg-gray-900/70 p-6">
            <div>
              <label className="mb-2 block text-sm text-gray-300">Subject</label>
              <select value={selectedSubjectId || ''} onChange={(event) => setSubject(event.target.value)} className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-white">
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>{subject.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-300">Task</label>
              <select value={selectedTaskId || ''} onChange={(event) => setTask(event.target.value)} className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-white">
                <option value="">No task</option>
                {tasks.map((task) => (
                  <option key={task._id} value={task._id}>{task.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {popupData && <XPPopup data={popupData} onClose={() => setPopupData(null)} />}
    </div>
  )
}

export default PomodoroTimer
