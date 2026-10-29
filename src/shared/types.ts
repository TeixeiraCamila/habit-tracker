export type HabitKind = 'boolean' | 'counter'

export type FreqType = 'daily' | 'weekdays' | 'times_per_week'

export interface Habit {
  id: number
  groupId: number | null
  name: string
  description?: string
  icon: string
  kind: HabitKind
  target: number
  unit?: string
  freqType: FreqType
  freqDays?: number[]
  freqTimes?: number
  reminderTime?: string
  startDate: string
  archivedAt?: string
  position: number
}
