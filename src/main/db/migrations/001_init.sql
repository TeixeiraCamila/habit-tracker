-- Migração inicial do banco: cria as tabelas do app (Fase 2 do planejamento).

CREATE TABLE groups (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  color      TEXT NOT NULL,
  icon       TEXT NOT NULL,
  position   INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE habits (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id      INTEGER REFERENCES groups(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  icon          TEXT NOT NULL,
  kind          TEXT NOT NULL DEFAULT 'boolean' CHECK (kind IN ('boolean', 'counter')),
  target        INTEGER NOT NULL DEFAULT 1,
  unit          TEXT,
  freq_type     TEXT NOT NULL DEFAULT 'daily'
                CHECK (freq_type IN ('daily', 'weekdays', 'times_per_week')),
  freq_days     TEXT,
  freq_times    INTEGER,
  reminder_time TEXT,
  start_date    TEXT NOT NULL,
  position      INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE completions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id   INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date       TEXT NOT NULL,
  value      INTEGER NOT NULL DEFAULT 1,
  note       TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (habit_id, date)
);

CREATE INDEX idx_completions_date ON completions(date);
CREATE INDEX idx_habits_group ON habits(group_id, position);

CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);