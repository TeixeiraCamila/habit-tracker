import { beforeEach, describe, expect, it } from 'vitest'
import { openDb, type Db } from '../db/connection'
import { migrate } from '../db/migrate'
import { groupsRepo } from './groups'
import { habitsRepo } from './habits'
import { completionsRepo } from './completions'
import { settingsRepo } from './settings'
import type { NewHabit } from '@shared/types'

const newHabit = (over: Partial<NewHabit> = {}): NewHabit => ({
  groupId: null,
  name: 'Beber água',
  icon: 'Droplets',
  kind: 'boolean',
  target: 1,
  freqType: 'daily',
  startDate: '2026-11-04',
  ...over
})

let db: Db
beforeEach(() => {
  db = openDb(':memory:')
  migrate(db)
})

describe('groups', () => {
  it('cria, ordena e reordena', () => {
    const repo = groupsRepo(db)
    const a = repo.create({ name: 'A', color: 'orange', icon: 'Sunrise' })
    const b = repo.create({ name: 'B', color: 'green', icon: 'Dumbbell' })
    expect(repo.list().map((g) => g.name)).toEqual(['A', 'B'])
    repo.reorder([b.id, a.id])
    expect(repo.list().map((g) => g.name)).toEqual(['B', 'A'])
  })
})

describe('habits', () => {
  it('guarda e devolve freqDays como array', () => {
    const repo = habitsRepo(db)
    const h = repo.create(newHabit({ freqType: 'weekdays', freqDays: [1, 3, 5] }))
    expect(repo.get(h.id).freqDays).toEqual([1, 3, 5])
  })

  it('arquiva e restaura', () => {
    const repo = habitsRepo(db)
    const h = repo.create(newHabit())
    repo.archive(h.id, true)
    expect(repo.list()).toHaveLength(0)
    expect(repo.list({ archived: true })).toHaveLength(1)
    repo.archive(h.id, false)
    expect(repo.list()).toHaveLength(1)
  })

  it('atualiza só os campos enviados', () => {
    const repo = habitsRepo(db)
    const h = repo.create(newHabit())
    const u = repo.update(h.id, { name: 'Água', target: 8 })
    expect(u.name).toBe('Água')
    expect(u.target).toBe(8)
    expect(u.icon).toBe('Droplets')
  })
})

describe('completions', () => {
  it('marcar duas vezes o mesmo dia atualiza, não duplica', () => {
    const habit = habitsRepo(db).create(newHabit())
    const repo = completionsRepo(db)
    repo.set(habit.id, '2026-11-04', 1)
    repo.set(habit.id, '2026-11-04', 3, 'ok')
    const all = repo.range('2026-11-01', '2026-11-30')
    expect(all).toHaveLength(1)
    expect(all[0]).toMatchObject({ value: 3, note: 'ok' })
  })

  it('clear remove o check-in', () => {
    const habit = habitsRepo(db).create(newHabit())
    const repo = completionsRepo(db)
    repo.set(habit.id, '2026-11-04', 1)
    repo.clear(habit.id, '2026-11-04')
    expect(repo.range('2026-11-01', '2026-11-30')).toHaveLength(0)
  })

  it('apagar o hábito apaga o histórico', () => {
    const habit = habitsRepo(db).create(newHabit())
    completionsRepo(db).set(habit.id, '2026-11-04', 1)
    habitsRepo(db).remove(habit.id)
    expect(completionsRepo(db).range('2026-01-01', '2026-12-31')).toHaveLength(0)
  })
})

describe('settings', () => {
  it('devolve os padrões e guarda só o que mudou', () => {
    const repo = settingsRepo(db)
    expect(repo.get().weekStartsOn).toBe(0)
    expect(repo.set({ weekStartsOn: 0 }).weekStartsOn).toBe(0)
    expect(repo.get().notifications).toBe(true)
  })
})
