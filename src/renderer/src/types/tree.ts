import type { GroupColor } from '@shared/types'

export interface TreeHabit {
  id: number
  name: string
  icon: string
}

export interface TreeGroup {
  id: number
  name: string
  color: GroupColor
  icon: string
  habits: TreeHabit[]
}
