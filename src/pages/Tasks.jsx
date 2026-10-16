import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Plus, ListTodo, Flag, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { ALL_PRIORITIES, ALL_STATUSES, PRIORITIES, STATUSES } from '../constants'
import SectionHeading from '../components/SectionHeading'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'
import FilterSelect from '../components/FilterSelect'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(ALL_STATUSES)
  const [priority, setPriority] = useState(ALL_PRIORITIES)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.getTasks(), api.getProjects()])
      .then(([taskData, projectData]) => { setTasks(taskData); setProjects(projectData) })
      .catch(() => setError('We could not load tasks. Check that the API is running.'))
      .finally(() => setLoading(false))
  }, [])

  // Cele trei criterii se combină cu AND: o sarcină trebuie să le îndeplinească pe toate.
  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || [task.title, task.assignee].some((value) => (value || '').toLowerCase().includes(query))
    const matchesStatus = status === ALL_STATUSES || task.status === status
    const matchesPriority = priority === ALL_PRIORITIES || task.priority === priority
    return matchesSearch && matchesStatus && matchesPriority
  }), [tasks, search, status, priority])

  const hasActiveFilters = search.trim() !== '' || status !== ALL_STATUSES || priority !== ALL_PRIORITIES

  function resetFilters() {
    setSearch('')
    setStatus(ALL_STATUSES)
    setPriority(ALL_PRIORITIES)
  }

  return (
    <div className="page-content">
      <SectionHeading eyebrow="YOUR WORKSPACE" title="All tasks" description="Keep track of the details that move your projects forward." action="Create task" to="/tasks/new" />
      <div className="task-summary-strip">
        <div className="summary-icon"><ListTodo size={19} /></div>
        <div><strong>{tasks.length} tasks in your workspace</strong><span>Stay focused on what matters most.</span></div>
        <div className="summary-spacer" />
        <span className="summary-completed">{tasks.filter((t) => t.status === 'Done').length} completed</span>
      </div>
      <div className="card tasks-card">
        <div className="task-toolbar">
          <div className="search-wrap">
            <Search size={17} />
            <input aria-label="Search tasks" placeholder="Search tasks or people..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <FilterSelect id="status-filter" label="Filter by status" icon={SlidersHorizontal} value={status} onChange={setStatus} allLabel={ALL_STATUSES} options={STATUSES} />
          <FilterSelect id="priority-filter" label="Filter by priority" icon={Flag} value={priority} onChange={setPriority} allLabel={ALL_PRIORITIES} options={PRIORITIES} />
          {hasActiveFilters && (
            <button type="button" className="button button-ghost reset-filters" onClick={resetFilters}>
              <RotateCcw size={14} />Reset filters
            </button>
          )}
        </div>
        {error && <div className="form-error" role="alert">{error}</div>}
        {loading ? <div className="loading-state">Loading tasks…</div> : (
          <div className="table-wrap">
            <table className="tasks-table">
              <thead>
                <tr><th>Task name</th><th>Assignee</th><th>Due date</th><th>Priority</th><th>Status</th><th><span className="sr-only">Open</span></th></tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <Link to={`/tasks/${task.id}`} className="table-task-title">
                        <span className={`table-task-icon ${task.status === 'Done' ? 'task-icon-done' : ''}`}>{task.status === 'Done' ? '✓' : '↗'}</span>
                        <span><strong>{task.title}</strong><small>{projects.find((p) => p.id === task.projectId)?.name || 'Unassigned'}</small></span>
                      </Link>
                    </td>
                    <td><span className="assignee-cell"><span className="mini-avatar">{(task.assignee || '?').split(' ').map((s) => s[0]).join('').slice(0, 2)}</span>{task.assignee || 'Unassigned'}</span></td>
                    <td className="date-cell">{new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
                    <td><PriorityBadge priority={task.priority} /></td>
                    <td><StatusBadge status={task.status} /></td>
                    <td><Link to={`/tasks/${task.id}`} className="row-open" aria-label={`Open ${task.title}`}>↗</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTasks.length === 0 && !error && (
              tasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"><Plus size={22} /></div>
                  <strong>No tasks yet</strong>
                  <p>Create your first task to get started.</p>
                  <Link className="button button-primary" to="/tasks/new">Create task</Link>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon"><Search size={22} /></div>
                  <strong>No tasks found</strong>
                  <p>Try another search or adjust your filters.</p>
                  <button type="button" className="button button-ghost" onClick={resetFilters}>Reset filters</button>
                </div>
              )
            )}
          </div>
        )}
        <div className="table-footer"><span aria-live="polite">Showing {filteredTasks.length} of {tasks.length} tasks</span><span>Updated just now</span></div>
      </div>
    </div>
  )
}