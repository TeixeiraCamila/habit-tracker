// Acesso SQL às configurações chave/valor no processo principal.
import type { Db } from '../db/connection'
import type { Settings } from '@shared/types'
import { DEFAULT_SETTINGS } from '@shared/defaults'

interface SettingsRepo {
  get: () => Settings
  set(patch: Partial<Settings>): Settings
}

export function settingsRepo(db: Db): SettingsRepo {
  const get = (): Settings => {
    const rows = db.prepare('SELECT key, value FROM settings').all() as {
      key: string
      value: string
    }[]
    const stored = Object.fromEntries(rows.map((r) => [r.key, JSON.parse(r.value)]))
    return { ...DEFAULT_SETTINGS, ...stored }
  }

  return {
    get,

    set(patch: Partial<Settings>): Settings {
      const stmt = db.prepare(
        'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value'
      )
      db.transaction(() => {
        for (const [key, value] of Object.entries(patch)) stmt.run(key, JSON.stringify(value))
      })()
      return get()
    }
  }
}
