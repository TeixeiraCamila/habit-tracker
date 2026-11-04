// Aplica as migrações SQL em ordem dentro de uma transação e registra o progresso.

import type { Db } from './connection'

// o Vite embute os .sql no bundle, então não depende de caminho em disco
const files = import.meta.glob('./migrations/*.sql', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>

const migrations = Object.entries(files)
  .map(([path, sql]) => ({ version: parseInt(path.split('/').pop()!, 10), sql }))
  .sort((a, b) => a.version - b.version)

export function migrate(db: Db): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version    INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  const rows = db.prepare('SELECT version FROM schema_migrations').all() as { version: number }[]
  const applied = new Set(rows.map((r) => r.version))

  for (const m of migrations) {
    if (applied.has(m.version)) continue
    // Cada migração roda isolada em transação: falha faz rollback do script.
    db.transaction(() => {
      db.exec(m.sql)
      db.prepare('INSERT INTO schema_migrations (version) VALUES (?)').run(m.version)
    })()
  }
}
