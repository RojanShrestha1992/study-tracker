import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api.js'
import useToastStore from '../stores/toastStore.js'
import useTimerStore from '../stores/timerStore.js'
import useUserStore from '../stores/userStore.js'
import Button from '../components/ui/Button.jsx'
import DeleteAccountModal from '../components/settings/DeleteAccountModal.jsx'

const DEFAULT_SETTINGS = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsBeforeLongBreak: 4,
}

function Settings() {
  const navigate = useNavigate()
  const addToast = useToastStore((state) => state.addToast)
  const user = useUserStore((state) => state.user)
  const fetchUser = useUserStore((state) => state.fetchUser)
  const clearUser = useUserStore((state) => state.clearUser)
  const timerRunning = useTimerStore((state) => state.isRunning)
  const initTimer = useTimerStore((state) => state.initTimer)

  const [form, setForm] = useState(DEFAULT_SETTINGS)
  const [original, setOriginal] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    const settings = user?.settings || DEFAULT_SETTINGS
    const nextSettings = {
      workDuration: Number(settings.workDuration || DEFAULT_SETTINGS.workDuration),
      shortBreak: Number(settings.shortBreak || DEFAULT_SETTINGS.shortBreak),
      longBreak: Number(settings.longBreak || DEFAULT_SETTINGS.longBreak),
      sessionsBeforeLongBreak: Number(settings.sessionsBeforeLongBreak || DEFAULT_SETTINGS.sessionsBeforeLongBreak),
    }

    setForm(nextSettings)
    setOriginal(nextSettings)
  }, [user])

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(original),
    [form, original]
  )

  const updateField = (field) => (event) => {
    const value = Number(event.target.value)
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const { data } = await api.put('/api/user/me/settings', form)
      addToast('Settings saved!', 'success')
      await fetchUser()
      setOriginal(form)

      if (!timerRunning) {
        initTimer(data?.settings || form)
      } else {
        addToast('Settings saved! Changes apply after current session ends.', 'info')
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to save settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm(DEFAULT_SETTINGS)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    clearUser()
    navigate('/login', { replace: true })
  }

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/api/user/me')
      addToast('Account deleted', 'success')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      clearUser()
      navigate('/login', { replace: true })
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to delete account', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-espresso">⚙️ Settings</h1>
        <p className="mt-2 text-warmgray">Customize your study experience</p>
      </header>

      <section className="rounded-2xl border border-sand bg-surface p-6 shadow-warm">
        <h2 className="mb-1 text-xl font-semibold text-espresso">⏱️ Pomodoro Timer</h2>
        <p className="mb-6 text-sm text-warmgray">Adjust durations to fit your workflow</p>

        <div className="space-y-5">
          {[
            {
              label: 'Focus Session Duration',
              description: 'How long each work session lasts',
              field: 'workDuration',
              min: 1,
              max: 120,
              suffix: 'minutes',
            },
            {
              label: 'Short Break Duration',
              description: 'Break between focus sessions',
              field: 'shortBreak',
              min: 1,
              max: 60,
              suffix: 'minutes',
            },
            {
              label: 'Long Break Duration',
              description: 'Extended break after multiple sessions',
              field: 'longBreak',
              min: 1,
              max: 60,
              suffix: 'minutes',
            },
            {
              label: 'Sessions Before Long Break',
              description: 'How many focus sessions before a long break',
              field: 'sessionsBeforeLongBreak',
              min: 2,
              max: 10,
              suffix: 'sessions',
            },
          ].map((item) => (
            <div key={item.field} className="flex flex-col gap-2 border-b border-sand pb-5 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <label className="block font-medium text-espresso">{item.label}</label>
                <p className="text-xs text-warmgray">{item.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={item.min}
                  max={item.max}
                  value={form[item.field]}
                  onChange={updateField(item.field)}
                  className="w-24 rounded-lg border border-sand bg-cream px-3 py-2 text-espresso focus:border-primary focus:outline-none"
                />
                <span className="text-sm text-warmgray">{item.suffix}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm italic text-espresso">
            💡 You'll study for {form.workDuration} min, then take a {form.shortBreak} min break. After every {form.sessionsBeforeLongBreak} sessions, you'll get a {form.longBreak} min long break.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={handleSave} disabled={!isDirty || loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            Reset to Defaults
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-status-missed/30 bg-status-missed/5 p-6 shadow-warm">
        <h2 className="mb-1 text-xl font-semibold text-status-missed">⚠️ Danger Zone</h2>
        <p className="mb-6 text-sm text-warmgray">Irreversible actions</p>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 border-b border-status-missed/20 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-espresso">Log out</p>
              <p className="text-xs text-warmgray">Sign out of your account</p>
            </div>
            <Button variant="secondary" onClick={handleLogout}>Logout</Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-espresso">Delete Account</p>
              <p className="text-xs text-warmgray">Permanently delete your account and all data</p>
            </div>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>Delete Account</Button>
          </div>
        </div>
      </section>

      <DeleteAccountModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        username={user?.name || ''}
        onConfirm={handleDeleteAccount}
      />
    </div>
  )
}

export default Settings