import { useEffect, useMemo, useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import api from '../../utils/api.js'
import useToastStore from '../../stores/toastStore.js'

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#F97316']
const ICONS = ['📚', '📐', '⚛️', '💻', '🎨', '🎵', '🌍', '🧪', '📖', '🏛️', '💡', '🔬']

function SubjectModal({ isOpen, onClose, subject, onSuccess }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [icon, setIcon] = useState(ICONS[0])
  const [loading, setLoading] = useState(false)
  const addToast = useToastStore((state) => state.addToast)

  useEffect(() => {
    if (subject) {
      setName(subject.name || '')
      setColor(subject.color || COLORS[0])
      setIcon(subject.icon || ICONS[0])
    } else {
      setName('')
      setColor(COLORS[0])
      setIcon(ICONS[0])
    }
  }, [subject, isOpen])

  const isValid = useMemo(() => name.trim() && color && icon, [name, color, icon])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isValid || loading) return

    setLoading(true)

    try {
      if (subject) {
        await api.put(`/api/subjects/${subject._id}`, { name: name.trim(), color, icon })
      } else {
        await api.post('/api/subjects', { name: name.trim(), color, icon })
      }

      addToast('Subject saved!', 'success')
      onSuccess()
      onClose()
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to save subject', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={subject ? 'Edit Subject' : 'Add Subject'}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-warmgray">Name</label>
          <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-sand bg-cream px-3 py-2 text-espresso outline-none" placeholder="Math" />
        </div>

        <div>
          <label className="mb-2 block text-sm text-warmgray">Color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((item) => (
              <button key={item} type="button" onClick={() => setColor(item)} className={`h-10 w-10 rounded-full border-2 ${color === item ? 'ring-2 ring-white' : 'border-transparent'}`} style={{ backgroundColor: item }} />
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-warmgray">Icon</label>
          <div className="grid grid-cols-6 gap-2">
            {ICONS.map((item) => (
              <button key={item} type="button" onClick={() => setIcon(item)} className={`rounded-xl p-2 text-xl ${icon === item ? 'bg-primary-light' : 'bg-cream'}`}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isValid || loading}>
            {loading ? 'Saving...' : subject ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default SubjectModal
