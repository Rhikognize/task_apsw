import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Plus, ListTodo } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import SectionHeading from '../components/SectionHeading'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All status')
  const [priority, setPriority] = useState('All priorities')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.getTasks(), api.getProjects()])
      .then(([taskData, projectData]) => { setTasks(taskData); setProjects(projectData) })
      .catch(() => setError('We could not load tasks. Check that the API is running.'))
      .finally(() => setLoading(false))
  }, [])

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const query = search.toLowerCase()
    const matchesSearch = task.title.toLowerCase().includes(query) || task.assignee.includes(search)
    const matchesStatus = status === 'All status' || task.status === status
    const matchesPriority = priority === 'All priorities' || task.priority === priority
    return matchesSearch && matchesStatus && matchesPriority
  }), [tasks, search, status, priority])

  return (
    <div className="page-content">
      <SectionHeading eyebrow="YOUR WORKSPACE" title="All tasks" description="Keep track of the details that move your projects forward." action="Create task" to="/tasks/new" />
      <div className="task-summary-strip"><div className="summary-icon"><ListTodo size={19} /></div><div><strong>{tasks.length} tasks in your workspace</strong><span>Stay focused on what matters most.</span></div><div className="summary-spacer" /><span className="summary-completed">{tasks.filter(t => t.status === 'Done').length} completed</span></div>
      <div className="card tasks-card">
        <div className="task-toolbar">
          <div className="search-wrap"><Search size={17} /><input aria-label="Search tasks" placeholder="Search tasks or people..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="filter-wrap"><SlidersHorizontal size={16} /><select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}><option>All status</option><option>To do</option><option>In progress</option><option>Review</option><option>Done</option></select></div>
          {/* The priority filter is intentionally not part of the starter requirements. */}
        </div>
        {error && <div className="form-error">{error}</div>}
        {loading ? <div className="loading-state">Loading tasks…</div> : <div className="table-wrap"><table className="tasks-table"><thead><tr><th>Task name</th><th>Assignee</th><th>Due date</th><th>Priority</th><th>Status</th><th><span className="sr-only">Open</span></th></tr></thead><tbody>
          {filteredTasks.map((task) => <tr key={task.id}><td><Link to={`/tasks/${task.id}`} className="table-task-title"><span className={`table-task-icon ${task.status === 'Done' ? 'task-icon-done' : ''}`}>{task.status === 'Done' ? '✓' : '↗'}</span><span><strong>{task.title}</strong><small>{projects.find((p) => p.id === task.projectId)?.name || 'Unassigned'}</small></span></Link></td><td><span className="assignee-cell"><span className="mini-avatar">{(task.assignee || '?').split(' ').map(s => s[0]).join('').slice(0,2)}</span>{task.assignee || 'Unassigned'}</span></td><td className="date-cell">{new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td><td><PriorityBadge priority={task.priority} /></td><td><StatusBadge status={task.status} /></td><td><Link to={`/tasks/${task.id}`} className="row-open" aria-label={`Open ${task.title}`}>↗</Link></td></tr>)}
        </tbody></table>
        {filteredTasks.length === 0 && <div className="empty-state"><div className="empty-icon"><Search size={22} /></div><strong>No tasks found</strong><p>Try another search or adjust your filters.</p><button className="button button-ghost" onClick={() => { setSearch(''); setStatus('All status'); setPriority('All priorities') }}>Clear filters</button></div>}
        </div>}
        <div className="table-footer"><span>Showing {filteredTasks.length} of {tasks.length} tasks</span><span>Updated just now</span></div>
      </div>
    </div>
  )
}
