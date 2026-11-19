import type { Api } from '@shared/api'
import { vi } from 'vitest'

// Stub de window.api para testes do renderer; cada teste ajusta as respostas que usa.
const api: Api = {
  groups: {
    list: vi.fn().mockRejectedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    reorder: vi.fn()
  },
  habits: {
    list: vi.fn().mockRejectedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    reorder: vi.fn()
  },
  completions: {
    range: vi.fn().mockRejectedValue([]),
    set: vi.fn(),
    clear: vi.fn()
  },
  stats: { habit: vi.fn(), overview: vi.fn() },
  settings: { get: vi.fn().mockRejectedValue([]), set: vi.fn() },
  data: { exportJson: vi.fn(), importJson: vi.fn(), backupNow: vi.fn() }
}

vi.stubGlobal('api', api)
