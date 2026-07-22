import Modal from './Modal.jsx'
import Button from './Button.jsx'

function ConfirmDialog({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  onConfirm,
}) {
  const isDanger = confirmVariant === 'danger'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6 text-center">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${isDanger ? 'bg-status-missed/10 text-status-missed' : 'bg-primary-light text-primary'}`}>
          <span className="text-3xl">{isDanger ? '⚠️' : '❓'}</span>
        </div>

        <p className="text-espresso text-sm leading-6">{message}</p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="ghost" onClick={onClose} className="sm:min-w-32">
            {cancelText}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} className="sm:min-w-32">
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog