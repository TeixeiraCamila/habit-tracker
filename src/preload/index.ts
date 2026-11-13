// Ponte segura entre o renderer e o processo principal.
// Expoe apenas window.api; nao libera acesso generico ao ipcRenderer.
import type { Api } from '@shared/api'
import { IPC } from '@shared/ipc-channels'
import { contextBridge, ipcRenderer } from 'electron'
import type { IpcResult } from '@shared/result'

async function call<T>(channel: string, ...args: unknown[]): Promise<T> {
  const res = (await ipcRenderer.invoke(channel, ...args)) as IpcResult<T>
  if (!res.ok) throw new Error(res.message)
  return res.data
}

const api: Api = {
  groups: {
    list: () => call(IPC.groups.list),
    create: (g) => call(IPC.groups.create, g),
    update: (id, patch) => call(IPC.groups.update, id, patch),
    remove: (id) => call(IPC.groups.remove, id),
    reorder: (ids) => call(IPC.groups.reorder, ids)
  },
  habits: {
    list: () => call(IPC.habits.list),
    create: (h) => call(IPC.habits.create, h),
    update: (id, patch) => call(IPC.habits.update, id, patch),
    remove: (id) => call(IPC.habits.remove, id),
    reorder: (groupId, ids) => call(IPC.habits.reorder, groupId, ids)
  },
  completions: {
    range: (from, to) => call(IPC.completions.range, from, to),
    set: (habitId, date, value, note) => call(IPC.completions.set, habitId, date, value, note),
    clear: (habitId, date) => call(IPC.completions.clear, habitId, date)
  },
  stats: {
    habit: (id) => call(IPC.stats.habit, id),
    overview: (from, to) => call(IPC.stats.overview, from, to)
  },
  settings: {
    get: () => call(IPC.settings.get),
    set: (patch) => call(IPC.settings.set, patch)
  },
  data: {
    exportJson: () => call(IPC.data.exportJson),
    importJson: (path) => call(IPC.data.importJson, path),
    backupNow: () => call(IPC.data.backupNow)
  }
}

contextBridge.exposeInMainWorld('api', api)
