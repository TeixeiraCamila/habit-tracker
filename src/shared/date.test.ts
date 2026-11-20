import { describe, expect, it } from 'vitest'
import {
  addDaysToKey,
  formatDay,
  formatFullDate,
  startOfWeekKey,
  toDateKey,
  todayKey
} from '@shared/date'

describe('toDateKey', () => {
  // Cria uma data local no fim do dia (29/10/2026 às 23:30). Em fusos negativos,
  // esse mesmo instante já pertence a 30/10 em UTC; o teste garante que a função
  // preserve o dia do calendário local e devolva a data no formato esperado.
  it('converte uma data local para YYYY-MM-DD sem deslocar o dia por UTC', () => {
    expect(toDateKey(new Date(2026, 9, 29, 23, 30))).toBe('2026-10-29')
  })
})

describe('addDaysToKey', () => {
  it('atravessa meses e anos-semana sem sair do formato local', () => {
    expect(addDaysToKey('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDaysToKey('2026-03-01', -1)).toBe('2026-02-28')
  })
})

describe('todayKey', () => {
  it('considera o dia anterior antes da virada configurada', () => {
    expect(todayKey(new Date(2026, 10, 19, 3, 30), '04:00')).toBe('2026-11-18')
    expect(todayKey(new Date(2026, 10, 19, 4, 0), '04:00')).toBe('2026-11-19')
  })

  it('usa o dia corrente com a virada padrão', () => {
    expect(todayKey(new Date(2026, 10, 19, 0, 1))).toBe('2026-11-19')
  })
})

describe('startOfWeekKey', () => {
  it('respeita domingo ou segunda como primeiro dia', () => {
    expect(startOfWeekKey('2026-11-18', 0)).toBe('2026-11-15')
    expect(startOfWeekKey('2026-11-18', 1)).toBe('2026-11-16')
  })
})

describe('formatação', () => {
  it('mostra o dia e a data por extenso em português', () => {
    expect(formatDay('2026-11-19')).toBe('Quinta-feira, 19 de novembro')
    expect(formatFullDate('2026-11-19')).toBe('Quinta-feira, 19 de novembro de 2026')
  })
})
