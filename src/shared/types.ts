// Tipos compartilhados entre os processos; inclui os modelos de grupos e hábitos.
export type HabitKind = 'boolean' | 'counter'

export type FreqType = 'daily' | 'weekdays' | 'times_per_week'

export type GroupColor = 'orange' | 'yellow' | 'green' | 'red' | 'blue' | 'lilac' | 'pink'

export interface Group {
  id: number
  name: string
  color: GroupColor
  icon: string
  position: number
}

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
