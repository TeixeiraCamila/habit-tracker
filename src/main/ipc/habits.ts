// Handlers IPC dos hábitos; o contrato abaixo é usado pelo preload e pelo renderer.
import type { Db } from '../db/connection'
import { habitsRepo } from '../repositories/habits'
import { IPC } from '@shared/ipc-channels'
import { habitPatchSchema, idSchema, newHabitSchema } from '@shared/schemas'
import { handle } from './handle'
import { z } from 'zod'

export function registerHabitsIpc(db: Db): void {
  const repo = habitsRepo(db)

  handle(IPC.habits.list, (opts) =>
    repo.list(z.object({ archived: z.boolean().optional() }).optional().parse(opts))
  )
  handle(IPC.habits.create, (h) => repo.create(newHabitSchema.parse(h)))
  handle(IPC.habits.update, (id, patch) =>
    repo.update(idSchema.parse(id), habitPatchSchema.parse(patch))
  )
  handle(IPC.habits.archive, (id, archived) =>
    repo.archive(idSchema.parse(id), z.boolean().parse(archived))
  )
  handle(IPC.habits.remove, (id) => repo.remove(idSchema.parse(id)))
  handle(IPC.habits.reorder, (groupId, ids) =>
    repo.reorder(idSchema.nullable().parse(groupId), z.array(idSchema).parse(ids))
  )
}
