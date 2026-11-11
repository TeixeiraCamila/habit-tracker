import { describe, expect, it } from 'vitest'
import { openDb } from './connection'
import { migrate } from './migrate'
import { seedDev } from './seed'

describe('seedDev', () => {
  it('popula o banco vazio e não repete', () => {
    const db = openDb(':memory:')
    migrate(db)
    expect(seedDev(db)).toBe(true)

    const count = (t: string): number =>
      (db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get() as { n: number }).n
    expect(count('groups')).toBe(4)
    expect(count('habits')).toBe(9)
    expect(count('completions')).toBeGreaterThan(100)

    expect(seedDev(db)).toBe(false)
    expect(count('groups')).toBe(4)
  })
})
