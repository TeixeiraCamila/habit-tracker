// Regras puras de frequência e conclusão, usadas pela tela Hoje e depois por streaks.
import { startOfWeekKey, weekdayOf } from './date'
import type { Completion, Habit } from './types'

export function isCompleted(habit: Habit, completion?: Completion): boolean {
  return Boolean(completion && completion.value >= habit.target)
}

// weekCompletions deve conter os check-ins da semana da data avaliada.
export function isDue(
  habit: Habit,
  date: string,
  weekCompletions: Completion[] = [],
  weekStartsOn: 0 | 1 = 0
): boolean {
  if (date < habit.startDate) return false
  if (habit.freqType === 'daily') return true
  if (habit.freqType === 'weekdays') return (habit.freqDays ?? []).includes(weekdayOf(date))

  const weekStart = startOfWeekKey(date, weekStartsOn)
  const done = weekCompletions.filter(
    (c) => c.date >= weekStart && c.date <= date && isCompleted(habit, c)
  ).length
  return done < (habit.freqTimes ?? 1)
}
