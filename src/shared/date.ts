// Utilitários de data em string local YYYY-MM-DD, sem conversão para UTC.
export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDaysToKey(key: string, days: number): string {
  return toDateKey(addDays(parseDateKey(key), days))
}

// O dia começa às dayStartsAt: antes disso, "hoje" ainda é o dia anterior.
export function todayKey(now: Date, dayStartsAt = '00:00'): string {
  const [hours, minutes] = dayStartsAt.split(':').map(Number)
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
  return toDateKey(now < start ? addDays(now, -1) : now)
}

export function weekdayOf(key: string): number {
  return parseDateKey(key).getDay()
}

export function startOfWeekKey(key: string, weekStartsOn: 0 | 1 = 0): string {
  return addDaysToKey(key, -((weekdayOf(key) - weekStartsOn + 7) % 7))
}

const dayFormat = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long'
})
const fullFormat = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function formatDay(key: string): string {
  return capitalize(dayFormat.format(parseDateKey(key)))
}

export function formatFullDate(key: string): string {
  return capitalize(fullFormat.format(parseDateKey(key)))
}
