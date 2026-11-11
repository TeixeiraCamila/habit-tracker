// Handlers IPC dos grupos de hábitos.
import type { Db } from '../db/connection'
import { groupsRepo } from '../repositories/groups'
import { IPC } from '@shared/ipc-channels'
import { groupPatchSchema, idSchema, newGroupSchema } from '@shared/schemas'
import { handle } from './handle'
import { z } from 'zod'

export function registerGroupsIpc(db: Db): void {
  const repo = groupsRepo(db)

  handle(IPC.groups.list, () => repo.list())
  handle(IPC.groups.create, (g) => repo.create(newGroupSchema.parse(g)))
  handle(IPC.groups.update, (id, patch) =>
    repo.update(idSchema.parse(id), groupPatchSchema.parse(patch))
  )
  handle(IPC.groups.remove, (id) => repo.remove(idSchema.parse(id)))
  handle(IPC.groups.reorder, (ids) => repo.reorder(z.array(idSchema).parse(ids)))
}
