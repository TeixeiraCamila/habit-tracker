// Store do Pinia dos hábitos.
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@renderer/api'
import type { Habit, NewHabit } from '@shared/types'

export const useHabitsStore = defineStore('habits', () => {
  const items = ref<Habit[]>([]) // só hábitos ativos (não arquivados)
  const selectedHabitId = ref<number | null>(null)

  async function load(): Promise<void> {
    items.value = await api.habits.list()
    console.log('🚀 ~ load ~ items.value:', items.value)
  }

  async function create(h: NewHabit): Promise<Habit> {
    const created = await api.habits.create(h)
    items.value.push(created)
    return created
  }

  async function update(id: number, patch: Partial<NewHabit>): Promise<Habit> {
    const updated = await api.habits.update(id, patch)
    await load()
    return updated
  }

  async function archive(id: number, archived: boolean): Promise<void> {
    await api.habits.archive(id, archived)
    await load()
  }

  async function remove(id: number): Promise<void> {
    items.value = items.value.filter((h) => h.id !== id)
  }

  return { items, selectedHabitId, load, create, update, archive, remove }
})
