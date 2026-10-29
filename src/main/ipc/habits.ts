import type { Habit } from '@shared/types'

// Contrato dos handlers IPC do domínio de hábitos (Fase 2 do planejamento).
export interface HabitsIpc {
  list(options?: { archived?: boolean }): Promise<Habit[]>
}
