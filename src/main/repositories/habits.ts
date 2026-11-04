// Acesso SQL aos hábitos e suas configurações no processo principal.
import type { Db } from '../db/connection'
import type { Habit, NewHabit } from '@shared/types'

interface HabitRow {
  id: number
  group_id: number | null
  name: string
  description: string | null
  icon: string
  kind: Habit['kind']
  target: number
  unit: string | null
  freq_type: Habit['freqType']
  freq_days: string | null
  freq_times: number | null
  reminder_time: string | null
  start_date: string
  archived_at: string | null
  position: number
}

const toHabit = (r: HabitRow): Habit => ({
  id: r.id,
  groupId: r.group_id,
  name: r.name,
  description: r.description ?? undefined,
  icon: r.icon,
  kind: r.kind,
  target: r.target,
  unit: r.unit ?? undefined,
  freqType: r.freq_type,
  freqDays: r.freq_days ? (JSON.parse(r.freq_days) as number[]) : undefined,
  freqTimes: r.freq_times ?? undefined,
  reminderTime: r.reminder_time ?? undefined,
  startDate: r.start_date,
  archivedAt: r.archived_at ?? undefined,
  position: r.position
})

// campo do Habit -> coluna; o valor é convertido para o formato do banco
const FIELDS: Record<string, [column: string, convert?: (v: unknown) => unknown]> = {
  groupId: ['group_id'],
  name: ['name'],
  description: ['description'],
  icon: ['icon'],
  kind: ['kind'],
  target: ['target'],
  unit: ['unit'],
  freqType: ['freq_type'],
  freqDays: ['freq_days', (v) => (v == null ? null : JSON.stringify(v))],
  freqTimes: ['freq_times'],
  reminderTime: ['reminder_time'],
  startDate: ['start_date']
}

interface HabitsRepo {
  list(opts?: { archived?: boolean }): Habit[]
  get: (id: number) => Habit
  create(h: NewHabit): Habit
  update(id: number, patch: Partial<NewHabit>): Habit
  archive(id: number, archived: boolean): void
  remove(id: number): void
  reorder(groupId: number | null, ids: number[]): void
}

export function habitsRepo(db: Db): HabitsRepo {
  const get = (id: number): Habit =>
    toHabit(db.prepare('SELECT * FROM habits WHERE id = ?').get(id) as HabitRow)

  return {
    list(opts?: { archived?: boolean }): Habit[] {
      const where = opts?.archived ? 'archived_at IS NOT NULL' : 'archived_at IS NULL'
      const rows = db
        .prepare(`SELECT * FROM habits WHERE ${where} ORDER BY group_id, position, id`)
        .all() as HabitRow[]
      return rows.map(toHabit)
    },

    get,

    create(h: NewHabit): Habit {
      const { next } = db
        .prepare('SELECT COALESCE(MAX(position), -1) + 1 AS next FROM habits WHERE group_id IS ?')
        .get(h.groupId) as { next: number }
      const info = db
        .prepare(
          `INSERT INTO habits
             (group_id, name, description, icon, kind, target, unit, freq_type,
              freq_days, freq_times, reminder_time, start_date, position)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          h.groupId,
          h.name,
          h.description ?? null,
          h.icon,
          h.kind,
          h.target,
          h.unit ?? null,
          h.freqType,
          h.freqDays ? JSON.stringify(h.freqDays) : null,
          h.freqTimes ?? null,
          h.reminderTime ?? null,
          h.startDate,
          next
        )
      return get(Number(info.lastInsertRowid))
    },

    update(id: number, patch: Partial<NewHabit>): Habit {
      const sets: string[] = []
      const values: unknown[] = []
      for (const [key, value] of Object.entries(patch)) {
        const field = FIELDS[key]
        if (!field) continue
        sets.push(`${field[0]} = ?`)
        values.push(field[1] ? field[1](value) : (value ?? null))
      }
      if (sets.length) {
        db.prepare(`UPDATE habits SET ${sets.join(', ')} WHERE id = ?`).run(...values, id)
      }
      return get(id)
    },

    archive(id: number, archived: boolean): void {
      db.prepare(
        archived
          ? "UPDATE habits SET archived_at = datetime('now') WHERE id = ?"
          : 'UPDATE habits SET archived_at = NULL WHERE id = ?'
      ).run(id)
    },

    remove(id: number): void {
      db.prepare('DELETE FROM habits WHERE id = ?').run(id)
    },

    reorder(groupId: number | null, ids: number[]): void {
      const stmt = db.prepare('UPDATE habits SET position = ?, group_id = ? WHERE id = ?')
      db.transaction(() => ids.forEach((id, i) => stmt.run(i, groupId, id)))()
    }
  }
}
