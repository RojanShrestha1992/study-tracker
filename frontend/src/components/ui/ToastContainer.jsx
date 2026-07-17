import useToastStore from '../../stores/toastStore.js'
import Toast from './Toast.jsx'

function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  return (
    <div className="fixed right-4 top-4 z-50 flex w-80 flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

export default ToastContainer
