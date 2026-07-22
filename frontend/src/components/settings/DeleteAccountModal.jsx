import { useEffect, useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'

function DeleteAccountModal({ isOpen, onClose, username, onConfirm }) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setValue('')
      setLoading(false)
    }
  }, [isOpen])

  const canDelete = value === username && !loading

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await onConfirm?.()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Account">
      <div className="space-y-5 text-center">
        <div className="text-4xl text-status-missed">🚨</div>
        <p className="text-espresso text-sm leading-6">
          This action is irreversible. All your data — sessions, tasks, subjects, and badges — will be permanently deleted.
        </p>
        <p className="text-status-missed text-sm font-semibold">This cannot be undone.</p>

        <div className="text-left">
          <label className="mb-2 block text-sm text-warmgray">Type your username ({username}) to confirm</label>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="w-full rounded-lg border border-sand bg-cream px-3 py-2 text-espresso outline-none focus:border-status-missed"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="ghost" onClick={onClose} className="sm:min-w-32">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} disabled={!canDelete} className="sm:min-w-32">
            {loading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteAccountModal