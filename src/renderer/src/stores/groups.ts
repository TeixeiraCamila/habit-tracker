// Store do Pinia dos grupos de hábitos.
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@renderer/api'
import { useHabitsStore } from './habits'
import type { Group, NewGroup } from '@shared/types'

export const useGroupsStore = defineStore('groups', () => {
  const items = ref<Group[]>([])

  async function load(): Promise<void> {
    items.value = await api.groups.list()
  }

  async function create(g: NewGroup): Promise<Group> {
    const created = await api.groups.create(g)
    items.value.push(created)
    return created
  }

  async function update(id: number, patch: Partial<NewGroup>): Promise<Group> {
    const updated = await api.groups.update(id, patch)
    const i = items.value.findIndex((g) => g.id === id)
    if (i >= 0) items.value[i] = updated
    return updated
  }

  async function remove(id: number): Promise<void> {
    await api.groups.remove(id)
    items.value = items.value.filter((g) => g.id !== id)
    // no banco, os hábitos do grupo ficam com groupId = null
    await useHabitsStore().load()
  }

  return { items, load, create, update, remove }
})
