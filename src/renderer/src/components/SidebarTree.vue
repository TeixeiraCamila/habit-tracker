<script setup lang="ts">
import { ref } from 'vue'
import type { TreeGroup, TreeHabit } from '@renderer/types/tree'
import GroupRow from './GroupRow.vue'
import HabitRow from './HabitRow.vue'
import TreeGuide from './TreeGuide.vue'
import StarDivider from './StarDivider.vue'

const props = defineProps<{
  groups: TreeGroup[]
  ungrouped?: TreeHabit[]
  selectedHabitId?: number | null
}>()

defineEmits<{
  'select-habit': [id: number, selected: boolean]
  'context-menu': [payload: { kind: 'group' | 'habit'; id: number; event: MouseEvent }]
}>()

// Estado interno: ids de grupos recolhidos; um grupo novo nasce aberto.
const collapsed = ref<Set<number>>(new Set())
const isOpen = (id: number): boolean => !collapsed.value.has(id)

function toggle(id: number): void {
  if (collapsed.value.has(id)) collapsed.value.delete(id)
  else collapsed.value.add(id)
}

defineExpose({
  collapseAll: (): void => {
    collapsed.value = new Set(props.groups.map((g) => g.id))
  },
  expandAll: (): void => {
    collapsed.value.clear()
  }
})
</script>

<template>
  <nav class="sidebar-tree" aria-label="Grupos e hábitos">
    <section v-for="group in groups" :key="group.id" class="sidebar-tree__group">
      <GroupRow
        :name="group.name"
        :color="group.color"
        :icon="group.icon"
        :expanded="isOpen(group.id)"
        @toggle="toggle(group.id)"
        @context-menu="$emit('context-menu', { kind: 'group', id: group.id, event: $event })"
      />

      <div
        :class="{ open: isOpen(group.id) }"
        class="collapse sidebar-tree__children"
        :inert="!isOpen(group.id)"
      >
        <div class="collapse-inner">
          <TreeGuide :color="group.color">
            <HabitRow
              v-for="habit in group.habits"
              :key="habit.id"
              :name="habit.name"
              :icon="habit.icon"
              :selected="habit.id === selectedHabitId"
              @select="$emit('select-habit', habit.id, $event)"
              @context-menu="$emit('context-menu', { kind: 'habit', id: habit.id, event: $event })"
            />
          </TreeGuide>
        </div>
      </div>
    </section>

    <section v-if="ungrouped?.length" class="sidebar-tree__ungrouped">
      <p class="sidebar-tree__label">Sem grupo</p>
      <HabitRow
        v-for="habit in ungrouped"
        :key="habit.id"
        :name="habit.name"
        :icon="habit.icon"
        :selected="habit.id === selectedHabitId"
        @select="$emit('select-habit', habit.id, $event)"
        @context-menu="$emit('context-menu', { kind: 'habit', id: habit.id, event: $event })"
      />
    </section>

    <StarDivider />
  </nav>
</template>

<style scoped>
.sidebar-tree {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: 0 var(--space-4) var(--space-4);
  overflow-y: auto;
}

.sidebar-tree__group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.sidebar-tree__children {
  padding-left: var(--space-2);
}

.sidebar-tree__label {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.sidebar-tree__empty {
  padding: var(--space-4);
  font-size: var(--text-sm);
  color: var(--text-muted);
  text-align: center;
}

/* animação de altura sem medir o conteúdo */
.collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--motion-base) var(--ease-out);
}

.collapse.open {
  grid-template-rows: 1fr;
}

.collapse-inner {
  min-height: 0;
  overflow: hidden;
}
</style>
