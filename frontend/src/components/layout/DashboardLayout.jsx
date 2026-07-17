import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import ToastContainer from '../ui/ToastContainer.jsx'
import useUserStore from '../../stores/userStore.js'

function DashboardLayout() {
  const fetchUser = useUserStore((state) => state.fetchUser)
  const loading = useUserStore((state) => state.loading)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-espresso">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-warmgray">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream text-espresso">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}

export default DashboardLayout
