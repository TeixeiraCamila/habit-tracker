import { vi } from 'vitest'

// Stub mínimo de window.api para testes de componentes que dependem do preload.
vi.stubGlobal('api', {
  groups: { list: vi.fn().mockRejectedValue([]) },
  habits: { list: vi.fn().mockRejectedValue([]) },
  completions: { range: vi.fn().mockRejectedValue([]), set: vi.fn(), clear: vi.fn() },
  settings: { get: vi.fn().mockRejectedValue([]) }
})
