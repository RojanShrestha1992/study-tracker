import { useEffect, useRef, useState } from 'react'
import api from '../../utils/api.js'
import useToastStore from '../../stores/toastStore.js'
import useUserStore from '../../stores/userStore.js'

function EditableUsername({ username, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(username || '')
  const inputRef = useRef(null)
  const addToast = useToastStore((state) => state.addToast)
  const fetchUser = useUserStore((state) => state.fetchUser)

  useEffect(() => {
    setValue(username || '')
  }, [username])

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const validateUsername = (candidate) => /^[A-Za-z0-9_]{3,20}$/.test(candidate)

  const handleSave = async () => {
    const nextValue = value.trim()

    if (!validateUsername(nextValue)) {
      addToast('Username must be 3-20 characters and use only letters, numbers, or underscores.', 'error')
      return
    }

    try {
      const { data } = await api.put('/api/user/me', { username: nextValue })
      addToast('Username updated!', 'success')
      setIsEditing(false)
      setValue(data?.user?.name || nextValue)
      onUpdate?.(data?.user)
      await fetchUser()
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to update username', 'error')
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSave()
    }

    if (event.key === 'Escape') {
      setValue(username || '')
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-3">
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-lg border border-sand bg-cream px-3 py-1 text-3xl font-bold text-espresso outline-none focus:border-primary"
        />
        <div className="flex gap-2">
          <button type="button" onClick={handleSave} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white shadow-warm hover:bg-primary-hover">
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setValue(username || '')
              setIsEditing(false)
            }}
            className="rounded-lg border border-sand bg-surface px-3 py-2 text-sm font-semibold text-espresso"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="group inline-flex items-center gap-2 text-left"
    >
      <span className="text-3xl font-bold text-espresso">{username}</span>
      <span className="opacity-0 transition-opacity group-hover:opacity-100">✏️</span>
    </button>
  )
}

export default EditableUsername