// Handlers IPC das configurações do app.
import type { Db } from '../db/connection'
import { settingsRepo } from '../repositories/settings'
import { IPC } from '@shared/ipc-channels'
import { settingsPatchSchema } from '@shared/schemas'
import { handle } from './handle'

export function registerSettingsIpc(db: Db): void {
  const repo = settingsRepo(db)

  handle(IPC.settings.get, () => repo.get())
  handle(IPC.settings.set, (patch) => repo.set(settingsPatchSchema.parse(patch)))
}
