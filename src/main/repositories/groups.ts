// Acesso SQL aos grupos de hábitos no processo principal.
import type { Db } from '../db/connection'
import type { Group, NewGroup } from '@shared/types'

const COLUMNS = 'id, name, color, icon, position'

interface GroupsRepo {
  list(): Group[]
  get: (id: number) => Group
  create(g: NewGroup): Group
  update(id: number, patch: Partial<NewGroup>): Group
  remove(id: number): void
  reorder(ids: number[]): void
}

export function groupsRepo(db: Db): GroupsRepo {
  const get = (id: number): Group =>
    db.prepare(`SELECT ${COLUMNS} FROM groups WHERE id = ?`).get(id) as Group

  return {
    list(): Group[] {
      return db.prepare(`SELECT ${COLUMNS} FROM groups ORDER BY position, id`).all() as Group[]
    },

    get,

    create(g: NewGroup): Group {
      const { next } = db
        .prepare('SELECT COALESCE(MAX(position), -1) + 1 AS next FROM groups')
        .get() as { next: number }
      const info = db
        .prepare('INSERT INTO groups (name, color, icon, position) VALUES (?, ?, ?, ?)')
        .run(g.name, g.color, g.icon, next)
      return get(Number(info.lastInsertRowid))
    },

    update(id: number, patch: Partial<NewGroup>): Group {
      const current = get(id)
      const next = { ...current, ...patch }
      db.prepare('UPDATE groups SET name = ?, color = ?, icon = ? WHERE id = ?').run(
        next.name,
        next.color,
        next.icon,
        id
      )
      return get(id)
    },

    remove(id: number): void {
      db.prepare('DELETE FROM groups WHERE id = ?').run(id)
    },

    reorder(ids: number[]): void {
      const stmt = db.prepare('UPDATE groups SET position = ? WHERE id = ?')
      db.transaction(() => ids.forEach((id, i) => stmt.run(i, id)))()
    }
  }
}
