// Monta a árvore de grupos e hábitos a partir dos stores.
import { computed, type ComputedRef } from 'vue'
import { useGroupsStore } from '@renderer/stores/groups'
import { useHabitsStore } from '@renderer/stores/habits'
import type { TreeGroup, TreeHabit } from '@renderer/types/tree'
import type { Habit } from '@shared/types'

const toTreeHabit = ({ id, name, icon }: Habit): TreeHabit => ({ id, name, icon })

export function useTree(): {
  treeGroups: ComputedRef<TreeGroup[]>
  ungrouped: ComputedRef<TreeHabit[]>
} {
  const groups = useGroupsStore()
  const habits = useHabitsStore()

  const treeGroups = computed<TreeGroup[]>(() =>
    groups.items.map((g) => ({
      ...g,
      habits: habits.items.filter((h) => h.groupId === g.id).map(toTreeHabit)
    }))
  )

  const ungrouped = computed<TreeHabit[]>(() =>
    habits.items.filter((h) => h.groupId === null).map(toTreeHabit)
  )

  return { treeGroups, ungrouped }
}
