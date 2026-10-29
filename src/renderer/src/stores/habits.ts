import type { Habit } from '@shared/types'

export interface HabitsState {
  habits: Habit[]
  selectedHabitId: number | null
}
