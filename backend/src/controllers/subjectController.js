import Subject from '../models/Subject.js'
import StudySession from '../models/StudySession.js'
import Task from '../models/Task.js'

export async function getSubjects(req, res, next) {
  try {
    const subjects = await Subject.find({ userId: req.user._id }).sort({ createdAt: 1 })

    const subjectIds = subjects.map((subject) => subject._id)
    const sessions = await StudySession.find({ userId: req.user._id, subjectId: { $in: subjectIds } })

    const sessionMap = new Map()
    for (const session of sessions) {
      const current = sessionMap.get(String(session.subjectId)) || 0
      sessionMap.set(String(session.subjectId), current + Number(session.duration || 0))
    }

    const payload = subjects.map((subject) => ({
      ...subject.toObject(),
      totalTimeStudied: sessionMap.get(String(subject._id)) || 0,
    }))

    res.json({ subjects: payload })
  } catch (error) {
    next(error)
  }
}

export async function createSubject(req, res, next) {
  try {
    const { name, color, icon } = req.body

    if (!name || !color || !icon) {
      return res.status(400).json({ message: 'Name, color, and icon are required' })
    }

    const subject = await Subject.create({
      userId: req.user._id,
      name,
      color,
      icon,
    })

    res.status(201).json({ subject })
  } catch (error) {
    next(error)
  }
}

export async function updateSubject(req, res, next) {
  try {
    const { id } = req.params
    const { name, color, icon } = req.body

    const subject = await Subject.findOne({ _id: id, userId: req.user._id })
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' })
    }

    if (name !== undefined) subject.name = name
    if (color !== undefined) subject.color = color
    if (icon !== undefined) subject.icon = icon

    await subject.save()
    res.json({ subject })
  } catch (error) {
    next(error)
  }
}

export async function deleteSubject(req, res, next) {
  try {
    const { id } = req.params
    const subject = await Subject.findOne({ _id: id, userId: req.user._id })

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' })
    }

    await Subject.deleteOne({ _id: id, userId: req.user._id })
    await StudySession.deleteMany({ userId: req.user._id, subjectId: id })
    await Task.deleteMany({ userId: req.user._id, subjectId: id })

    res.json({ message: 'Subject deleted' })
  } catch (error) {
    next(error)
  }
}
