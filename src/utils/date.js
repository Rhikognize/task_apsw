export function formatToday(options) {
  return new Date().toLocaleDateString('en-US', options)
}
export const todayLabel = () => formatToday({ weekday: 'long', month: 'long', day: 'numeric' })
export const todayEyebrow = () => formatToday({ weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()