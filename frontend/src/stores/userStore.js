import { create } from 'zustand'
import api from '../utils/api.js'

const useUserStore = create((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    try {
      set({ loading: true })
      const { data } = await api.get('/api/user/me')
      set({ user: data.user, loading: false })
    } catch {
      set({ user: null, loading: false })
    }
  },

  clearUser: () => set({ user: null, loading: false }),
}))

export default useUserStore
