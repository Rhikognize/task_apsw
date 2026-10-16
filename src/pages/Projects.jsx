import { useEffect, useState } from 'react'
import { ArrowUpRight, FolderKanban, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import SectionHeading from '../components/SectionHeading'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getProjects(), api.getTasks()])
      .then(([projectData, taskData]) => { setProjects(projectData); setTasks(taskData) })
      .finally(() => setLoading(false))
  }, [])

  return <div className="page-content"><SectionHeading eyebrow="YOUR WORKSPACE" title="Projects" description="A home for every idea, milestone, and team effort." /><div className="project-intro"><div className="project-intro-icon"><FolderKanban size={21} /></div><div><strong>Your team's work, organized.</strong><span>Explore projects and see what's moving forward.</span></div><span className="project-total">{projects.length} active projects</span></div>{loading ? <div className="loading-state">Loading projects…</div> : <div className="projects-grid">{projects.map((project, index) => { const projectTasks = tasks.filter((task) => task.projectId === project.id); const done = projectTasks.filter((task) => task.status === 'Done').length; const progress = projectTasks.length ? Math.round(done / projectTasks.length * 100) : 0; return <article className="project-card card" key={project.id}><div className="project-card-top"><div className="project-symbol" style={{ background: `${project.color}18`, color: project.color }}><FolderKanban size={21} /></div><button className="icon-button" aria-label="Project options" onClick={() => window.alert('Project options coming soon.')}><span>•••</span></button></div><span className="project-overline">PROJECT 0{index + 1}</span><h3>{project.name}</h3><p>{project.description}</p><div className="project-progress-meta"><span>Progress</span><strong>{progress}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%`, background: project.color }} /></div><div className="project-card-footer"><span>{projectTasks.length} tasks · {done} completed</span><Link to={`/projects/${project.id}`} className="project-open">View project <ArrowUpRight size={15} /></Link></div></article> })}<Link to="/projects" className="project-card add-project-card"><div className="add-project-icon"><Plus size={22} /></div><strong>Plan something new</strong><span>New project creation is coming soon.</span></Link></div>}</div>
}
