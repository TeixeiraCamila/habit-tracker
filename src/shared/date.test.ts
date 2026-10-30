import { describe, expect, it } from 'vitest'
import { toDateKey } from '@shared/date'

describe('toDateKey', () => {
  // Cria uma data local no fim do dia (29/10/2026 às 23:30). Em fusos negativos,
  // esse mesmo instante já pertence a 30/10 em UTC; o teste garante que a função
  // preserve o dia do calendário local e devolva a data no formato esperado.
  it('converte uma data local para YYYY-MM-DD sem deslocar o dia por UTC', () => {
    expect(toDateKey(new Date(2026, 9, 29, 23, 30))).toBe('2026-10-29')
  })
})
