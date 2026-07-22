import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import api from '../../utils/api.js'
import useToastStore from '../../stores/toastStore.js'
import useUserStore from '../../stores/userStore.js'
import { getAvatar, AVATARS } from '../../utils/avatars.js'

function AvatarModal({ isOpen, onClose, currentAvatar, onUpdate }) {
  const [savingAvatar, setSavingAvatar] = useState(null)
  const addToast = useToastStore((state) => state.addToast)
  const fetchUser = useUserStore((state) => state.fetchUser)

  const avatarKeys = Object.keys(AVATARS)

  const handleSelect = async (avatarKey) => {
    try {
      setSavingAvatar(avatarKey)
      await api.put('/api/user/me/avatar', { avatar: avatarKey })
      addToast('Avatar updated!', 'success')
      onUpdate?.(avatarKey)
      await fetchUser()
      onClose()
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to update avatar', 'error')
    } finally {
      setSavingAvatar(null)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Your Avatar">
      <div className="grid grid-cols-4 gap-4">
        {avatarKeys.map((key) => {
          const selected = key === currentAvatar

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleSelect(key)}
              disabled={Boolean(savingAvatar)}
              className={`flex aspect-square w-full items-center justify-center rounded-2xl border-2 bg-cream text-5xl transition-all hover:border-primary hover:bg-primary/5 ${selected ? 'border-primary ring-2 ring-primary/30' : 'border-sand'} disabled:cursor-not-allowed disabled:opacity-70`}
            >
              <span className={savingAvatar === key ? 'animate-pulse' : ''}>{getAvatar(key)}</span>
            </button>
          )
        })}
      </div>
    </Modal>
  )
}

export default AvatarModal