// Wrapper de IPC que padroniza erros: devolve IpcResult e loga o detalhe no main.
import { ipcMain } from 'electron'
import type { IpcResult } from '@shared/result'
import { toMessage } from './errors'

export function handle<R>(channel: string, fn: (...args: unknown[]) => R | Promise<R>): void {
  ipcMain.handle(channel, async (_event, ...args): Promise<IpcResult<R>> => {
    try {
      return { ok: true, data: await fn(...args) }
    } catch (err) {
      console.error(`[ipc] ${channel}`, err) // o detalhe fica no log, a UI recebe só a mensagem
      return { ok: false, message: toMessage(err) }
    }
  })
}
