import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, CheckCircle2, CircleDashed, Clock3, Plus, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import SectionHeading from '../components/SectionHeading'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getTasks(), api.getProjects()])
      .then(([taskData, projectData]) => { setTasks(taskData); setProjects(projectData) })
      .finally(() => setLoading(false))
  }, [])

  const completed = tasks.filter((task) => task.status === 'Done').length
  const inProgress = tasks.filter((task) => task.status === 'In progress').length
  const completion = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  return (
    <div className="page-content">
      <SectionHeading eyebrow="THURSDAY, OCTOBER 15, 2026" title="Good morning, Dana ✨" description="Here's what's happening across your workspace today." action="New task" to="/tasks/new" />
      <section className="welcome-banner">
        <div className="welcome-copy"><span className="banner-kicker"><span className="sparkle-dot">✦</span> YOUR WORKSPACE AT A GLANCE</span><h2>Make progress, <em>not just plans.</em></h2><p>A little progress each day adds up to big results. Let's make today count.</p><Link to="/tasks" className="banner-link">View all tasks <ArrowRight size={15} /></Link></div>
        <div className="banner-art" aria-hidden="true"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-card art-card-back" /><div className="art-card art-card-front"><CheckCircle2 size={25} /><span>Focus time</span><strong>02:45:18</strong><small>You're doing great!</small></div><div className="art-star star-one">✦</div><div className="art-star star-two">✳</div></div>
      </section>
      <section className="stats-grid">
        <div className="stat-card"><div className="stat-top"><span>Total tasks</span><span className="stat-icon purple"><CircleDashed size={17} /></span></div><div className="stat-value">{loading ? '—' : tasks.length}</div><div className="stat-foot"><span className="trend"><TrendingUp size={13} /> Workspace total</span></div></div>
        <div className="stat-card"><div className="stat-top"><span>Completed</span><span className="stat-icon green"><CheckCircle2 size={17} /></span></div><div className="stat-value">{loading ? '—' : completed}</div><div className="stat-foot"><span className="trend">{completion}% completion rate</span></div></div>
        <div className="stat-card"><div className="stat-top"><span>In progress</span><span className="stat-icon blue"><Clock3 size={17} /></span></div><div className="stat-value">{loading ? '—' : inProgress}</div><div className="stat-foot"><span className="stat-muted">Keep the momentum going</span></div></div>
        <div className="stat-card"><div className="stat-top"><span>Projects</span><span className="stat-icon amber"><CalendarDays size={17} /></span></div><div className="stat-value">{loading ? '—' : projects.length}</div><div className="stat-foot"><span className="stat-muted">Across your workspace</span></div></div>
      </section>
      <section className="dashboard-columns">
        <div className="card task-preview">
          <div className="card-heading"><div><h3>Recent tasks</h3><p>Your latest tasks, all in one place.</p></div><Link to="/tasks" className="text-link">View all <ArrowRight size={14} /></Link></div>
          {loading ? <div className="loading-state">Loading your tasks…</div> : <div className="task-list">
            {tasks.slice(0, 4).map((task) => <Link to={`/tasks/${task.id}`} className="task-row" key={task.id}><div className="task-row-check"><span className={`fake-check ${task.status === 'Done' ? 'checked' : ''}`}>{task.status === 'Done' ? '✓' : ''}</span></div><div className="task-row-main"><strong>{task.title}</strong><span>{projects.find((p) => p.id === task.projectId)?.name || 'Unassigned project'}</span></div><PriorityBadge priority={task.priority} /><StatusBadge status={task.status} /></Link>)}
            {tasks.length === 0 && <div className="empty-state">No tasks yet. Create your first task.</div>}
          </div>}
          <Link className="add-task-row" to="/tasks/new"><Plus size={16} /> Add a new task</Link>
        </div>
        <div className="right-column">
          <div className="card progress-card"><div className="card-heading"><div><h3>Workspace progress</h3><p>A snapshot of completed work.</p></div><span className="progress-icon"><TrendingUp size={17} /></span></div><div className="progress-number">{completion}<span>%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${completion}%` }} /></div><div className="progress-foot"><span>{completed} of {tasks.length} tasks completed</span><span className="progress-positive">Keep it up!</span></div></div>
          <div className="card tip-card"><div className="tip-icon">✦</div><div><span className="eyebrow">A LITTLE REMINDER</span><h3>One thing at a time.</h3><p>Focus on the next small step. Momentum follows clarity.</p></div></div>
        </div>
      </section>
    </div>
  )
}
