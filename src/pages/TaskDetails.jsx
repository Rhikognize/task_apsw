import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, CircleUserRound, Edit3, Trash2 } from 'lucide-react'
import { api } from '../api'
import SectionHeading from '../components/SectionHeading'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'
import TaskForm from '../components/TaskForm'

export default function TaskDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [projects, setProjects] = useState([])
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.getTask(id), api.getProjects()])
      .then(([taskData, projectData]) => { setTask(taskData); setProjects(projectData) })
      .catch(() => setError('This task could not be found.'))
      .finally(() => setLoading(false))
  }, [id])

  async function updateTask(form) {
    try {
      const updated = await api.updateTask(id, { ...form, projectId: form.projectId })
      setTask(updated)
      setEditing(false)
    } catch {
      setError('Could not save your changes.')
    }
  }

  async function deleteTask() {
    if (!window.confirm('Delete this task? This action cannot be undone.')) return
    try {
      await api.deleteTask(id)
      navigate('/tasks')
    } catch {
      setError('Could not delete this task.')
    }
  }

  if (loading) return <div className="loading-state">Loading task…</div>
  if (!task) return <div className="page-content"><div className="empty-state"><strong>Task not found</strong><p>{error || 'This task may have been removed.'}</p><Link className="button button-primary" to="/tasks">Back to tasks</Link></div></div>

  const project = projects.find((p) => p.id === task.projectId)

  return <div className="page-content">
    <Link to="/tasks" className="back-link"><ArrowLeft size={15} /> All tasks</Link>
    <SectionHeading eyebrow={project?.name || 'TASK DETAILS'} title={editing ? 'Edit task' : task.title} description={editing ? 'Update the task details below.' : task.description || 'No description has been added yet.'} />
    {error && <div className="form-error">{error}</div>}
    {editing ? <TaskForm initialValues={task} projects={projects} onSubmit={updateTask} submitLabel="Save changes" /> : <div className="detail-layout"><div className="card detail-main"><div className="detail-label">OVERVIEW</div><div className="detail-status-row"><StatusBadge status={task.status} /><PriorityBadge priority={task.priority} /></div><div className="detail-description">{task.description || 'No description has been added yet.'}</div><div className="detail-divider" /><div className="detail-meta-grid"><div className="detail-meta"><CalendarDays size={17} /><div><span>Due date</span><strong>{new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></div></div><div className="detail-meta"><CircleUserRound size={17} /><div><span>Assignee</span><strong>{task.assignee || 'Unassigned'}</strong></div></div></div></div><div className="card detail-actions"><h3>Manage task</h3><p>Keep information up to date as work progresses.</p><button className="button button-secondary full-button" onClick={() => setEditing(true)}><Edit3 size={16} />Edit task</button><button className="button button-danger full-button" onClick={deleteTask}><Trash2 size={16} />Delete task</button><div className="detail-project-link"><span>PROJECT</span><Link to={`/projects/${project?.id || ''}`}>{project?.name || 'No project'} <span>↗</span></Link></div></div></div>}
  </div>
}
