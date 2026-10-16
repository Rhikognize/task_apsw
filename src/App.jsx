import { useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Activity, ArrowUpRight, CheckSquare, FolderKanban, LayoutDashboard, Plus, Settings2, Sparkles } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import TaskDetails from './pages/TaskDetails'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import NewTask from './pages/NewTask'
import { api } from './api'

export default function App() {
  const [taskCount, setTaskCount] = useState(null)
  const { pathname } = useLocation()
  const [projects, setProjects] = useState([])
  const [apiError, setApiError] = useState(false)

  useEffect(() => {
    api.getProjects().then(setProjects).catch(() => setApiError(true))
  }, [])
  useEffect(() => {
  api.getTasks().then((tasks) => setTaskCount(tasks.length)).catch(() => setTaskCount(null))
}, [pathname])

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/tasks', label: 'Tasks', icon: CheckSquare },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Activity size={21} strokeWidth={2.5} /></div>
          <span>taskflow<span className="brand-dot">.</span></span>
        </div>
        <div className="workspace-switcher">
          <div className="workspace-avatar">S</div>
          <div className="workspace-copy"><strong>Studio North</strong><span>Free workspace</span></div>
          <Settings2 size={16} className="muted-icon" />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="main-nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} /><span>{label}</span>
              {label === 'Tasks' && taskCount !== null && <span className="nav-count">{taskCount}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-section-head"><span className="nav-label">YOUR PROJECTS</span><NavLink to="/projects" aria-label="View projects"><Plus size={16} /></NavLink></div>
        <div className="project-nav">
          {projects.map((project) => (
            <NavLink to={`/projects/${project.id}`} key={project.id} className="project-nav-item">
              <span className="project-dot" style={{ background: project.color }} />{project.name}
            </NavLink>
          ))}
          {projects.length === 0 && <span className="side-empty">Projects will appear here</span>}
        </div>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Sparkles size={17} /></div>
            <strong>Make room for focus</strong>
            <p>Bring your team's work into one calm space.</p>
            <button className="upgrade-link" onClick={() => window.alert('You are already on the TaskFlow workspace!')}>Explore workspace <ArrowUpRight size={14} /></button>
          </div>
          <div className="profile-row">
            <div className="profile-avatar">DP</div>
            <div className="profile-copy"><strong>Dana Popa</strong><span>Product designer</span></div>
            <span className="online-dot" />
          </div>
        </div>
      </aside>

      <main className="main-area">
        {apiError && <div className="api-warning">Could not connect to the local API. Start it with <code>npm run api</code>.</div>}
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>My workspace</strong></div>
          <div className="topbar-actions"><span className="today-label">Thursday, October 15</span><div className="top-avatar">DP</div></div>
        </header>
        <div className="page-wrap">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/new" element={<NewTask />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <footer className="app-footer"><span>Made for meaningful work.</span><span>TaskFlow <span className="footer-dot">●</span> Workspace edition</span></footer>
      </main>
    </div>
  )
}
