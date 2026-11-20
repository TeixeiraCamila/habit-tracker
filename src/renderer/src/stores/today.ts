// Store do dia aberto na tela Hoje: carrega check-ins e atualiza a UI antes do IPC.
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { api } from '@renderer/api'
import { useDate } from '@renderer/composables/useDate'
import { useToast } from '@renderer/composables/useToast'
import { errorMessage } from '@renderer/utils/errors'
import { addDaysToKey } from '@shared/date'
import { isCompleted, isDue } from '@shared/due'
import type { Completion, Habit } from '@shared/types'
import { useHabitsStore } from './habits'

export interface DueHabit {
  habit: Habit
  completion?: Completion
}

export const useTodayStore = defineStore('today', () => {
  const { today, weekStartsOn, startOfWeek } = useDate()
  const { error } = useToast()
  const habitsStore = useHabitsStore()

  const date = ref<string>(today.value)
  const completions = ref<Completion[]>([])
  const loading = ref(false)

  const isToday = computed(() => date.value === today.value)
  const canGoNext = computed(() => date.value < today.value)

  const due = computed<DueHabit[]>(() => {
    const weekStart = startOfWeek(date.value)
    const weekEnd = addDaysToKey(weekStart, 6)
    const inWeek = completions.value.filter((c) => c.date >= weekStart && c.date <= weekEnd)

    return habitsStore.items
      .filter((habit) => isDue(habit, date.value, inWeek, weekStartsOn.value))
      .map((habit) => ({ habit, completion: completion(habit.id) }))
  })

  const doneCount = computed(
    () => due.value.filter((d) => isCompleted(d.habit, d.completion)).length
  )
  const allDone = computed(() => due.value.length > 0 && doneCount.value === due.value.length)

  function completion(habitId: number): Completion | undefined {
    return completions.value.find((c) => c.habitId === habitId && c.date === date.value)
  }

  async function load(): Promise<void> {
    loading.value = true
    try {
      completions.value = await api.completions.range(
        addDaysToKey(date.value, -7),
        addDaysToKey(date.value, 7)
      )
    } finally {
      loading.value = false
    }
  }

  // Atualizações locais primeiro; qualquer falha do IPC devolve o valor anterior.
  async function write(habit: Habit, next: number | undefined): Promise<void> {
    const key = date.value
    const index = completions.value.findIndex((c) => c.habitId === habit.id && c.date === key)
    const previous = index >= 0 ? completions.value[index] : undefined
    const local: Completion | undefined = next
      ? { id: previous?.id ?? -1, habitId: habit.id, date: key, value: next }
      : undefined

    if (local) {
      completions.value =
        index >= 0
          ? completions.value.map((c, i) => (i === index ? local : c))
          : [...completions.value, local]
    } else {
      completions.value = completions.value.filter((_, i) => i !== index)
    }

    try {
      if (!local) {
        await api.completions.clear(habit.id, key)
        return
      }
      const saved = await api.completions.set(habit.id, key, local.value)
      completions.value = completions.value.map((c) =>
        c.habitId === habit.id && c.date === key ? saved : c
      )
    } catch (cause) {
      completions.value = completions.value.filter(
        (c) => !(c.habitId === habit.id && c.date === key)
      )
      if (previous) completions.value = [...completions.value, previous]
      throw cause
    }
  }

  function toggle(habit: Habit): Promise<void> {
    return isCompleted(habit, completion(habit.id))
      ? write(habit, undefined)
      : write(habit, habit.target)
  }

  function setCounter(habit: Habit, value: number): Promise<void> {
    const clamped = Math.max(0, Math.min(habit.target, value))
    return clamped === 0 ? write(habit, undefined) : write(habit, clamped)
  }

  function goToDay(key: string): void {
    if (key <= today.value) date.value = key
  }

  function goToToday(): void {
    date.value = today.value
  }

  function previousDay(): void {
    goToDay(addDaysToKey(date.value, -1))
  }

  function nextDay(): void {
    goToDay(addDaysToKey(date.value, 1))
  }

  // A virada do dia e a navegação de datas recarregam o intervalo de check-ins.
  watch(date, () => {
    void load().catch((cause) => error(errorMessage(cause)))
  })
  watch(today, (next, previous) => {
    if (date.value === previous) date.value = next
  })

  return {
    date,
    completions,
    loading,
    due,
    doneCount,
    allDone,
    isToday,
    canGoNext,
    load,
    completion,
    toggle,
    setCounter,
    goToDay,
    goToToday,
    previousDay,
    nextDay
  }
})
