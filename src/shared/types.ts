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

export type NewGroup = Omit<Group, 'id' | 'position'>

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
  position: number
}

export type NewHabit = Omit<Habit, 'id' | 'position'>

export interface Completion {
  id: number
  habitId: number
  date: string
  value: number
  note?: string
}

export interface Settings {
  dayStartsAt: string
  weekStartsOn: 0 | 1
  notifications: boolean
  launchAtLogin: boolean
  minimizeToTray: boolean
  autoBackup: boolean
}

export interface HabitStats {
  habitId: number
  currentStreak: number
  bestStreak: number
  totalCompletions: number
  completionRate: number
}

export interface Overview {
  totalHabits: number
  totalCompletions: number
  completionRate: number
  currentStreak: number
}
