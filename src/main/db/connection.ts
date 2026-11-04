// Abre e configura a conexão SQLite do processo principal (Fase 2).

import Database from 'better-sqlite3'
export type Db = Database.Database

// Instância única do banco do app; o getter garante que só existe após initDb.
let db: Db | null = null

// Recebe o caminho do arquivo; nos testes o banco em memória (' :memory:') substitui.
export function openDb(file: string): Db {
  const conn = new Database(file)
  conn.pragma('journal_mode = WAL')
  conn.pragma('foreign_keys = ON')
  return conn
}

export function initDb(file: string): Db {
  db = openDb(file)
  return db
}

export function getDb(): Db {
  if (!db) throw new Error('Banco não inicializado.')
  return db
}

export function closeDb(): void {
  db?.close()
  db = null
}
