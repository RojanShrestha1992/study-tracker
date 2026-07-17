import { useEffect, useState } from 'react'
import Button from '../components/ui/Button.jsx'
import SubjectCard from '../components/subjects/SubjectCard.jsx'
import SubjectModal from '../components/subjects/SubjectModal.jsx'
import api from '../utils/api.js'
import useToastStore from '../stores/toastStore.js'

function Subjects() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const addToast = useToastStore((state) => state.addToast)

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/api/subjects')
      setSubjects(data.subjects || [])
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to load subjects', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/subjects/${id}`)
      addToast('Subject deleted', 'info')
      fetchSubjects()
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to delete subject', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900/70 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">📚 My Subjects</h1>
          <p className="mt-1 text-gray-400">Organize your learning by topic and stay focused.</p>
        </div>
        <Button onClick={() => { setEditingSubject(null); setIsModalOpen(true) }}>
          + Add Subject
        </Button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-10 text-center text-gray-400">Loading subjects...</div>
      ) : subjects.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-10 text-center">
          <div className="mb-4 text-6xl">📚</div>
          <h2 className="text-xl font-semibold text-white">No subjects yet.</h2>
          <p className="mt-2 text-gray-400">Add your first one to start tracking your study plan.</p>
          <div className="mt-6 flex justify-center">
            <Button onClick={() => { setEditingSubject(null); setIsModalOpen(true) }}>Add Subject</Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard key={subject._id} subject={subject} onEdit={(item) => { setEditingSubject(item); setIsModalOpen(true) }} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <SubjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} subject={editingSubject} onSuccess={fetchSubjects} />
    </div>
  )
}

export default Subjects
