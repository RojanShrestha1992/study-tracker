import { create } from 'zustand'

const useToastStore = create((set) => ({
  toasts: [],

  addToast: (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))

    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
    }, 4000)
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}))

export default useToastStore
