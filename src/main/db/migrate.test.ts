import { describe, expect, it } from 'vitest'
import { openDb } from './connection'
import { migrate } from './migrate'

describe('migrate', () => {
  it('cria as tabelas do zero', () => {
    const db = openDb(':memory:')
    migrate(db)
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
      .all()
      .map((r) => (r as { name: string }).name)
    expect(tables).toEqual(
      expect.arrayContaining(['groups', 'habits', 'completions', 'settings', 'schema_migrations'])
    )
  })

  it('é idempotente', () => {
    const db = openDb(':memory:')
    migrate(db)
    migrate(db)
    const { n } = db.prepare('SELECT COUNT(*) AS n FROM schema_migrations').get() as { n: number }
    expect(n).toBe(1)
  })

  it('aplica o ON DELETE SET NULL ao apagar um grupo', () => {
    const db = openDb(':memory:')
    migrate(db)
    db.prepare("INSERT INTO groups (name, color, icon) VALUES ('Manhã', 'orange', 'Sunrise')").run()
    db.prepare(
      "INSERT INTO habits (group_id, name, icon, start_date) VALUES (1, 'Água', 'Droplets', '2026-11-04')"
    ).run()
    db.prepare('DELETE FROM groups WHERE id = 1').run()
    const h = db.prepare('SELECT group_id FROM habits').get() as { group_id: number | null }
    expect(h.group_id).toBeNull()
  })
})
