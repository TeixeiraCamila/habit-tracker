// Testes das regras de frequência: um hábito só é devido quando a frequência pede.
import { describe, expect, it } from 'vitest'
import { isCompleted, isDue } from '@shared/due'
import type { Completion, Habit, FreqType } from '@shared/types'

function habit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: 1,
    groupId: null,
    name: 'Hábito',
    icon: 'circle',
    kind: 'boolean',
    target: 1,
    freqType: 'daily',
    startDate: '2026-11-01',
    position: 0,
    ...overrides
  }
}

function completion(date: string, value = 1): Completion {
  return { id: 1, habitId: 1, date, value }
}

describe('isCompleted', () => {
  it('exige value maior ou igual à meta', () => {
    const counter = habit({ kind: 'counter', target: 3 })
    expect(isCompleted(counter, completion('2026-11-18', 2))).toBe(false)
    expect(isCompleted(counter, completion('2026-11-18', 3))).toBe(true)
    expect(isCompleted(counter)).toBe(false)
  })
})

describe('isDue', () => {
  it('considera todo dia devido, menos antes da data de início', () => {
    const daily = habit()
    expect(isDue(daily, '2026-11-02')).toBe(true)
    expect(isDue(daily, '2026-10-31')).toBe(false)
  })

  it('considera apenas os dias da semana escolhidos', () => {
    const weekdays = habit({ freqType: 'weekdays' as FreqType, freqDays: [1, 3, 5] })
    // 18/11/2026 é quarta-feira; 19/11 é quinta-feira.
    expect(isDue(weekdays, '2026-11-18')).toBe(true)
    expect(isDue(weekdays, '2026-11-19')).toBe(false)
  })

  it('conta conclusões da semana até a data para X vezes por semana', () => {
    const twice = habit({ freqType: 'times_per_week', freqTimes: 2 })
    const done = [completion('2026-11-15'), completion('2026-11-17')]

    expect(isDue(twice, '2026-11-18', done)).toBe(false)
    expect(isDue(twice, '2026-11-16', done.slice(0, 1))).toBe(true)
    expect(
      isDue(
        twice,
        '2026-11-18',
        done.map((c) => ({ ...c, value: 0 }))
      )
    ).toBe(true)
  })

  it('não mistura conclusões da semana anterior nem de datas futuras', () => {
    const once = habit({ freqType: 'times_per_week', freqTimes: 1 })
    expect(isDue(once, '2026-11-17', [completion('2026-11-15')])).toBe(false)
    expect(isDue(once, '2026-11-16', [completion('2026-11-08')])).toBe(true)
    expect(isDue(once, '2026-11-16', [completion('2026-11-17')])).toBe(true)
    expect(isDue(once, '2026-11-16', [completion('2026-11-16')])).toBe(false)
  })

  it('usa weekStartsOn para definir os limites da semana', () => {
    const once = habit({ freqType: 'times_per_week', freqTimes: 1 })
    const sunday = [completion('2026-11-15')]

    expect(isDue(once, '2026-11-16', sunday, 0)).toBe(false)
    expect(isDue(once, '2026-11-16', sunday, 1)).toBe(true)
  })
})
