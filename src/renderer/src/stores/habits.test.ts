// Testes unitários do store de hábitos: criação local e recarga após editar.
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@renderer/api'
import type { Habit, NewHabit } from '@shared/types'
import { useHabitsStore } from './habits'

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

const other: Habit = {
  id: 2,
  groupId: null,
  name: 'Ler',
  icon: 'book',
  kind: 'boolean',
  target: 1,
  freqType: 'daily',
  startDate: '2026-11-01',
  position: 1
}

const newHabit: NewHabit = {
  groupId: null,
  name: 'Caminhar',
  icon: 'footprints',
  kind: 'boolean',
  target: 1,
  freqType: 'daily',
  startDate: '2026-11-19'
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  vi.mocked(api.habits.list).mockResolvedValue([habit, other])
  vi.mocked(api.habits.create).mockResolvedValue({ ...newHabit, id: 3, position: 2 })
  vi.mocked(api.habits.update).mockResolvedValue({ ...habit, name: 'Beber água' })
  vi.mocked(api.habits.remove).mockResolvedValue(undefined)
})

describe('useHabitsStore', () => {
  it('carrega os hábitos vindos do IPC', async () => {
    const store = useHabitsStore()

    await store.load()

    expect(store.items).toEqual([habit, other])
  })

  it('cria um hábito e o acrescenta ao fim da lista', async () => {
    const store = useHabitsStore()
    await store.load()

    const created = await store.create(newHabit)

    expect(api.habits.create).toHaveBeenCalledWith(newHabit)
    expect(created.id).toBe(3)
    expect(store.items.map((h) => h.id)).toEqual([1, 2, 3])
  })

  it('atualiza um hábito recarregando a lista do IPC', async () => {
    const store = useHabitsStore()
    await store.load()
    const refreshed: Habit = { ...habit, name: 'Beber água', target: 6 }
    vi.mocked(api.habits.list).mockResolvedValueOnce([refreshed, other])

    const updated = await store.update(1, { name: 'Beber água' })

    expect(api.habits.update).toHaveBeenCalledWith(1, { name: 'Beber água' })
    expect(updated.name).toBe('Beber água')
    expect(api.habits.list).toHaveBeenCalledTimes(2)
    expect(store.items).toEqual([refreshed, other])
  })

  it('remove o hábito apenas na lista local', async () => {
    const store = useHabitsStore()
    await store.load()

    await store.remove(2)

    expect(api.habits.remove).toHaveBeenCalledWith(2)
    expect(store.items.map((h) => h.id)).toEqual([1])
    expect(api.habits.list).toHaveBeenCalledTimes(1)
  })

  it('mantém a lista intacta se a criação falhar', async () => {
    const store = useHabitsStore()
    await store.load()
    vi.mocked(api.habits.create).mockRejectedValueOnce(new Error('falha no IPC'))

    await expect(store.create(newHabit)).rejects.toThrow('falha no IPC')
    expect(store.items).toEqual([habit, other])
  })
})
