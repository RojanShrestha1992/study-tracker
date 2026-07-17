import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialState = {
  mode: 'focus',
  timeLeft: 1500,
  isRunning: false,
  sessionCount: 1,
  selectedSubjectId: null,
  selectedTaskId: null,
}

const useTimerStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      start: () => set({ isRunning: true }),
      pause: () => set({ isRunning: false }),
      reset: () => set((state) => ({ isRunning: false, timeLeft: state.mode === 'focus' ? 1500 : state.mode === 'shortBreak' ? 300 : 900 })),
      skip: () => set({ isRunning: false, timeLeft: 1500 }),
      tick: () => set((state) => ({ timeLeft: state.timeLeft > 0 ? state.timeLeft - 1 : 0 })),
      setSubject: (id) => set({ selectedSubjectId: id, selectedTaskId: null }),
      setTask: (id) => set({ selectedTaskId: id }),
      switchMode: (newMode, durations) => {
        const nextDuration =
          newMode === 'focus'
            ? durations.workDuration * 60
            : newMode === 'shortBreak'
              ? durations.shortBreak * 60
              : durations.longBreak * 60

        set({ mode: newMode, timeLeft: nextDuration, isRunning: false })
      },
      initTimer: (settings) => {
        const current = get()
        const target =
          current.mode === 'focus'
            ? settings.workDuration * 60
            : current.mode === 'shortBreak'
              ? settings.shortBreak * 60
              : settings.longBreak * 60

        if (current.timeLeft === initialState.timeLeft && current.mode === 'focus' && !current.isRunning) {
          set({ timeLeft: target })
        }
      },
    }),
    {
      name: 'study-tracker-timer',
      partialize: (state) => ({
        mode: state.mode,
        timeLeft: state.timeLeft,
        isRunning: state.isRunning,
        sessionCount: state.sessionCount,
        selectedSubjectId: state.selectedSubjectId,
        selectedTaskId: state.selectedTaskId,
      }),
    }
  )
)

export default useTimerStore
