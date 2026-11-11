// Registro central de todos os handlers IPC do app.
import type { Db } from '../db/connection'
import { registerGroupsIpc } from './groups'
import { registerHabitsIpc } from './habits'
import { registerCompletionsIpc } from './completions'
import { registerSettingsIpc } from './settings'

export function registerIpc(db: Db): void {
  registerGroupsIpc(db)
  registerHabitsIpc(db)
  registerCompletionsIpc(db)
  registerSettingsIpc(db)
}
