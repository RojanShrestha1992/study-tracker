import { useEffect, useMemo, useState } from 'react'
import api from '../../utils/api.js'
import useToastStore from '../../stores/toastStore.js'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'

function AddTaskModal({ isOpen, onClose, onSuccess }) {
  const addToast = useToastStore((state) => state.addToast)

  const [subjects, setSubjects] = useState([])
  const [loadingSubjects, setLoadingSubjects] = useState(false)

  const [title, setTitle] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = useMemo(() => Boolean(title.trim() && subjectId), [title, subjectId])

  useEffect(() => {
    if (!isOpen) return

    const loadSubjects = async () => {
      try {
        setLoadingSubjects(true)
        const { data } = await api.get('/api/subjects')
        setSubjects(data.subjects || [])
      } catch (error) {
        addToast(error.response?.data?.message || 'Unable to load subjects', 'error')
      } finally {
        setLoadingSubjects(false)
      }
    }

    loadSubjects()
  }, [isOpen, addToast])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit || submitting) return

    try {
      setSubmitting(true)
      await api.post('/api/tasks', { subjectId, title: title.trim() })
      addToast('Task created!', 'success')
      onSuccess?.()
      onClose()
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to create task', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setTitle('')
    setSubjectId('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Task">
      {loadingSubjects ? (
        <div className="text-warmgray">Loading subjects...</div>
      ) : subjects.length === 0 ? (
        <div className="text-center">
          <div className="text-3xl">📚</div>
          <h3 className="mt-3 text-espresso font-semibold">You need to create a subject first</h3>
          <p className="mt-2 text-sm text-warmgray">Add at least one subject so tasks can be assigned.</p>
          <div className="mt-5">
            <Button
              onClick={() => {
                handleClose()
                window.location.href = '/subjects'
              }}
            >
              Go to Subjects
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-warmgray">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-sand bg-cream px-3 py-2 text-espresso"
              placeholder="e.g., Math chapter 5"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-warmgray">Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full rounded-xl border border-sand bg-cream px-3 py-2 text-espresso"
              required
            >
              <option value="">Select a subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.icon} {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={!canSubmit || submitting}>
              Create Task
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default AddTaskModal

