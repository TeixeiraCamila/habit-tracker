// Handlers IPC dos hábitos; o contrato abaixo é usado pelo preload e pelo renderer.
import type { Habit } from '@shared/types'

export interface HabitsIpc {
  list(options?: { archived?: boolean }): Promise<Habit[]>
}
