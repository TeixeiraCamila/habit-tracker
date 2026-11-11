// Handlers IPC dos check-ins diários, chamados pelo renderer via preload.
import type { Db } from '../db/connection'
import { completionsRepo } from '../repositories/completions'
import { IPC } from '@shared/ipc-channels'
import { dateKeySchema, idSchema, setCompletionSchema } from '@shared/schemas'
import { handle } from './handle'

export function registerCompletionsIpc(db: Db): void {
  const repo = completionsRepo(db)

  handle(IPC.completions.range, (from, to) =>
    repo.range(dateKeySchema.parse(from), dateKeySchema.parse(to))
  )
  handle(IPC.completions.set, (habitId, date, value, note) => {
    const c = setCompletionSchema.parse({ habitId, date, value, note })
    return repo.set(c.habitId, c.date, c.value, c.note)
  })
  handle(IPC.completions.clear, (habitId, date) =>
    repo.clear(idSchema.parse(habitId), dateKeySchema.parse(date))
  )
}
