// Contrato de window.api compartilhado entre preload e renderer.
import type {
  Completion,
  Habit,
  HabitStats,
  Group,
  NewGroup,
  NewHabit,
  Overview,
  Settings
} from './types'

export interface Api {
  groups: {
    list(): Promise<Group[]>
    create(g: NewGroup): Promise<Group>
    update(id: number, g: Partial<NewGroup>): Promise<Group>
    remove(id: number): Promise<void>
    reorder(ids: number[]): Promise<void>
  }
  habits: {
    list(): Promise<Habit[]>
    create(h: NewHabit): Promise<Habit>
    update(id: number, h: Partial<Habit>): Promise<Habit>
    remove(id: number): Promise<void>
    reorder(groupId: number | null, ids: number[]): Promise<void>
  }
  completions: {
    range(from: string, to: string): Promise<Completion[]>
    set(habitId: number, date: string, value: number, note?: string): Promise<Completion>
    clear(habitId: number, date: string): Promise<void>
  }
  stats: {
    habit(id: number): Promise<HabitStats>
    overview(from: string, to: string): Promise<Overview>
  }
  settings: { get(): Promise<Settings>; set(s: Partial<Settings>): Promise<Settings> }
  data: {
    exportJson(): Promise<string>
    importJson(path: string): Promise<void>
    backupNow(): Promise<string>
  }
}
