// Testes do store do dia: frequência, navegação e check-ins otimistas.
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@renderer/api'
import { addDaysToKey, weekdayOf } from '@shared/date'
import type { Habit } from '@shared/types'
import { useHabitsStore } from './habits'
import { useTodayStore } from './today'

function habit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: 1,
    groupId: null,
    name: 'Hábito',
    icon: 'circle',
    kind: 'boolean',
    target: 1,
    freqType: 'daily',
    startDate: '2000-01-01',
    position: 0,
    ...overrides
  }
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  vi.mocked(api.completions.range).mockResolvedValue([])
  vi.mocked(api.completions.set).mockImplementation(async (habitId, date, value) => ({
    id: 10,
    habitId,
    date,
    value
  }))
  vi.mocked(api.completions.clear).mockResolvedValue(undefined)
})

describe('useTodayStore', () => {
  it('carrega os check-ins da janela ao redor da data', async () => {
    const store = useTodayStore()

    await store.load()

    expect(api.completions.range).toHaveBeenCalledWith(
      addDaysToKey(store.date, -7),
      addDaysToKey(store.date, 7)
    )
  })

  it('mostra só os hábitos devidos e os concluídos no dia', async () => {
    const store = useTodayStore()
    const daily = habit({ id: 1, name: 'Diário' })
    const weekday = habit({
      id: 2,
      name: 'Semanal',
      freqType: 'weekdays',
      freqDays: [weekdayOf(store.date)]
    })
    const future = habit({ id: 3, name: 'Futuro', startDate: addDaysToKey(store.date, 1) })
    useHabitsStore().items = [daily, weekday, future]
    vi.mocked(api.completions.range).mockResolvedValue([
      { id: 1, habitId: 1, date: store.date, value: 1 }
    ])

    await store.load()

    expect(store.due.map((d) => d.habit.id)).toEqual([1, 2])
    expect(store.due[0].completion?.value).toBe(1)
    expect(store.doneCount).toBe(1)
    expect(store.allDone).toBe(false)
  })

  it('marca o dia como completo quando todos os devidos estão feitos', async () => {
    const store = useTodayStore()
    useHabitsStore().items = [habit()]
    vi.mocked(api.completions.range).mockResolvedValue([
      { id: 1, habitId: 1, date: store.date, value: 1 }
    ])

    await store.load()

    expect(store.allDone).toBe(true)
  })

  it('aplica o check-in na UI antes da resposta do IPC', async () => {
    const store = useTodayStore()
    useHabitsStore().items = [habit()]
    await store.load()
    let resolveSet: (value: {
      id: number
      habitId: number
      date: string
      value: number
    }) => void = () => {}
    vi.mocked(api.completions.set).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSet = resolve
        })
    )

    const pending = store.toggle(habit())
    expect(store.completion(1)?.value).toBe(1)

    resolveSet({ id: 7, habitId: 1, date: store.date, value: 1 })
    await pending
    expect(store.completion(1)?.id).toBe(7)
  })

  it('desfaz a mudança se o IPC falhar', async () => {
    const store = useTodayStore()
    await store.load()
    vi.mocked(api.completions.set).mockRejectedValueOnce(new Error('falha no IPC'))

    await expect(store.toggle(habit())).rejects.toThrow('falha no IPC')
    expect(store.completion(1)).toBeUndefined()
  })

  it('limpa o check-in ao desmarcar um hábito feito', async () => {
    const store = useTodayStore()
    await store.load()
    vi.mocked(api.completions.range).mockResolvedValue([
      { id: 1, habitId: 1, date: store.date, value: 1 }
    ])
    await store.load()

    await store.toggle(habit())

    expect(api.completions.clear).toHaveBeenCalledWith(1, store.date)
    expect(store.completion(1)).toBeUndefined()
  })

  it('limita o contador à meta e remove o check-in ao zerar', async () => {
    const store = useTodayStore()
    const counter = habit({ kind: 'counter', target: 3 })
    await store.load()

    await store.setCounter(counter, 5)
    expect(store.completion(1)?.value).toBe(3)
    await store.setCounter(counter, 1)
    expect(store.completion(1)?.value).toBe(1)
    await store.setCounter(counter, 0)
    expect(api.completions.clear).toHaveBeenCalled()
    expect(store.completion(1)).toBeUndefined()
  })

  it('navega para dias passados e bloqueia dias futuros', async () => {
    const store = useTodayStore()
    await store.load()
    const today = store.date

    store.goToDay(addDaysToKey(today, 1))
    expect(store.date).toBe(today)

    store.previousDay()
    expect(store.date).toBe(addDaysToKey(today, -1))
    await nextTick()
    store.nextDay()
    expect(store.date).toBe(today)
    await nextTick()
    expect(api.completions.range).toHaveBeenCalledTimes(3)
    await flushPromises()
  })
})
