import Button from '../ui/Button.jsx'

function SubjectCard({ subject, onEdit, onDelete }) {
  return (
    <div className="rounded-3xl border border-sand bg-surface p-6 shadow-warm" style={{ borderLeft: `4px solid ${subject.color}` }}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="text-4xl">{subject.icon}</div>
        <div className="text-right text-sm text-warmgray">
          <p>{subject.totalTimeStudied || 0} min</p>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-espresso">{subject.name}</h3>
      <div className="mt-6 flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(subject)} className="flex-1 justify-center">
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(subject._id)} className="flex-1 justify-center">
          Delete
        </Button>
      </div>
    </div>
  )
}

export default SubjectCard
