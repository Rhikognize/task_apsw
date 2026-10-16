import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { Link } from 'react-router-dom'

const blankTask = { title: '', description: '', status: 'To do', priority: 'Medium', dueDate: '', projectId: '1', assignee: '' }

export default function TaskForm({ initialValues, projects, onSubmit, submitLabel = 'Create task' }) {
  const [form, setForm] = useState({ ...blankTask, ...initialValues })
  const [error, setError] = useState('')

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (form.title.trim().length === 0) {
      setError('A task title is required.')
      return
    }
    if (!form.dueDate) {
      setError('Please choose a due date.')
      return
    }
    setError('')
    await onSubmit(form)
  }

  return (
    <form className="task-form card" onSubmit={handleSubmit}>
      <div className="form-section-title"><span className="form-step">01</span><div><h3>Task details</h3><p>Give this task a clear name and context.</p></div></div>
      <div className="form-field">
        <label htmlFor="title">Task title <span>*</span></label>
        <input id="title" name="title" value={form.title} onChange={update} placeholder="e.g. Prepare launch checklist" />
      </div>
      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={form.description} onChange={update} placeholder="What needs to be done?" rows="4" />
      </div>
      <div className="form-grid">
        <div className="form-field"><label htmlFor="projectId">Project</label><select id="projectId" name="projectId" value={form.projectId} onChange={update}>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
        <div className="form-field"><label htmlFor="assignee">Assignee</label><input id="assignee" name="assignee" value={form.assignee} onChange={update} placeholder="Name" /></div>
        <div className="form-field"><label htmlFor="status">Status</label><select id="status" name="status" value={form.status} onChange={update}><option>To do</option><option>In progress</option><option>Review</option><option>Done</option></select></div>
        <div className="form-field"><label htmlFor="priority">Priority</label><select id="priority" name="priority" value={form.priority} onChange={update}><option>Low</option><option>Medium</option><option>High</option></select></div>
        <div className="form-field full-field"><label htmlFor="dueDate">Due date <span>*</span></label><input id="dueDate" type="date" name="dueDate" value={form.dueDate} onChange={update} /></div>
      </div>
      {error && <div className="form-error" role="alert">{error}</div>}
      <div className="form-actions"><Link to="/tasks" className="button button-ghost"><ArrowLeft size={16} />Cancel</Link><button className="button button-primary" type="submit"><Save size={16} />{submitLabel}</button></div>
    </form>
  )
}
