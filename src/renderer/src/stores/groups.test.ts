// Testes unitários do store de grupos: o estado local espelha o IPC.
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@renderer/api'
import type { Group, Habit, NewGroup } from '@shared/types'
import { useGroupsStore } from './groups'

const groups: Group[] = [
  { id: 1, name: 'Saúde', color: 'green', icon: 'heart', position: 0 },
  { id: 2, name: 'Estudo', color: 'blue', icon: 'book', position: 1 }
]

const habit: Habit = {
  id: 1,
  groupId: 1,
  name: 'Água',
  icon: 'droplets',
  kind: 'counter',
  target: 8,
  unit: 'copos',
  freqType: 'daily',
  startDate: '2026-11-01',
  position: 0
}

const newGroup: NewGroup = { name: 'Lazer', color: 'orange', icon: 'sun' }

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  vi.mocked(api.groups.list).mockResolvedValue([...groups])
  vi.mocked(api.groups.create).mockResolvedValue({ ...newGroup, id: 3, position: 2 })
  vi.mocked(api.groups.update).mockImplementation(async (id, patch) => ({
    ...groups.find((g) => g.id === id)!,
    ...patch
  }))
  vi.mocked(api.groups.remove).mockResolvedValue(undefined)
  vi.mocked(api.habits.list).mockResolvedValue([habit])
})

describe('useGroupsStore', () => {
  it('carrega os grupos vindos do IPC', async () => {
    const store = useGroupsStore()

    await store.load()

    expect(store.items).toEqual(groups)
  })

  it('cria um grupo e o acrescenta ao fim da lista', async () => {
    const store = useGroupsStore()
    await store.load()

    const created = await store.create(newGroup)

    expect(api.groups.create).toHaveBeenCalledWith(newGroup)
    expect(created.id).toBe(3)
    expect(store.items.map((g) => g.id)).toEqual([1, 2, 3])
  })

  it('atualiza um grupo sem mudar a ordem da lista', async () => {
    const store = useGroupsStore()
    await store.load()

    const updated = await store.update(2, { name: 'Estudos' })

    expect(api.groups.update).toHaveBeenCalledWith(2, { name: 'Estudos' })
    expect(store.items[1]).toEqual(updated)
    expect(store.items.map((g) => g.id)).toEqual([1, 2])
  })

  it('remove o grupo e recarrega os hábitos que ficaram sem grupo', async () => {
    const store = useGroupsStore()
    await store.load()

    await store.remove(1)

    expect(api.groups.remove).toHaveBeenCalledWith(1)
    expect(store.items.map((g) => g.id)).toEqual([2])
    expect(api.habits.list).toHaveBeenCalledTimes(1)
  })

  it('mantém a lista intacta se a criação falhar', async () => {
    const store = useGroupsStore()
    await store.load()
    vi.mocked(api.groups.create).mockRejectedValueOnce(new Error('falha no IPC'))

    await expect(store.create(newGroup)).rejects.toThrow('falha no IPC')
    expect(store.items).toEqual(groups)
  })
})
