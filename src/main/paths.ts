// Define os caminhos do processo principal (userData, banco e backups) na Fase 2.

import { app } from 'electron'
import { join } from 'path'

// Caminho do banco em userData; ajustes futuros (backups) entram aqui.
export const dbPath = (): string => join(app.getPath('userData'), 'habit-tracker.db')

// para encontrar .db
// ls -la ~/.config/
// explorer.exe .config
