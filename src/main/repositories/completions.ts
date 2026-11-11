// Acesso SQL aos check-ins diários (completions) no processo principal.
import type { Db } from '../db/connection'
import type { Completion } from '@shared/types'

interface CompletionRow {
  id: number
  habit_id: number
  date: string
  value: number
  note: string | null
}

const toCompletion = (r: CompletionRow): Completion => ({
  id: r.id,
  habitId: r.habit_id,
  date: r.date,
  value: r.value,
  note: r.note ?? undefined
})

interface CompletionsRepo {
  range(from: string, to: string): Completion[]
  set(habitId: number, date: string, value: number, note?: string): Completion
  clear(habitId: number, date: string): void
}

export function completionsRepo(db: Db): CompletionsRepo {
  return {
    range(from: string, to: string): Completion[] {
      const rows = db
        .prepare(
          'SELECT id, habit_id, date, value, note FROM completions WHERE date BETWEEN ? AND ? ORDER BY habit_id, date'
        )
        .all(from, to) as CompletionRow[]
      return rows.map(toCompletion)
    },

    set(habitId: number, date: string, value: number, note?: string): Completion {
      db.prepare(
        `INSERT INTO completions (habit_id, date, value, note) VALUES (?, ?, ?, ?)
         ON CONFLICT (habit_id, date) DO UPDATE SET value = excluded.value, note = excluded.note`
      ).run(habitId, date, value, note ?? null)
      const row = db
        .prepare(
          'SELECT id, habit_id, date, value, note FROM completions WHERE habit_id = ? AND date = ?'
        )
        .get(habitId, date) as CompletionRow
      return toCompletion(row)
    },

    clear(habitId: number, date: string): void {
      db.prepare('DELETE FROM completions WHERE habit_id = ? AND date = ?').run(habitId, date)
    }
  }
}
