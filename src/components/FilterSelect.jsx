
export default function FilterSelect({ id, label, icon: Icon, value, onChange, allLabel, options }) {
  const isActive = value !== allLabel

  return (
    <div className={`filter-wrap ${isActive ? 'is-active' : ''}`}>
      <label htmlFor={id} className="sr-only">{label}</label>
      <Icon size={16} aria-hidden="true" />
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value={allLabel}>{allLabel}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  )
}