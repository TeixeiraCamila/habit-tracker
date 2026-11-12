import { describe, expect, it } from 'vitest'
import { newHabitSchema } from '@shared/schemas'
import { toFieldErrors } from './form'

const base = {
  groupId: null,
  name: 'Água',
  icon: 'Droplets',
  kind: 'boolean',
  target: 1,
  freqType: 'daily',
  startDate: '2026-11-11'
}

describe('toFieldErrors', () => {
  it('mapeia um erro por campo, em português', () => {
    const r = newHabitSchema.safeParse({ ...base, name: ' ', target: '', startDate: '' })
    expect(r.success).toBe(false)
    if (!r.success) {
      expect(toFieldErrors(r.error)).toEqual({
        name: 'Informe um nome',
        target: 'Informe a meta',
        startDate: 'Informe uma data válida'
      })
    }
  })

  it('pede os dias quando a frequência é por dias da semana', () => {
    const r = newHabitSchema.safeParse({ ...base, freqType: 'weekdays' })
    expect(r.success).toBe(false)
    if (!r.success) expect(toFieldErrors(r.error).freqDays).toBe('Escolha ao menos um dia')
  })
})
