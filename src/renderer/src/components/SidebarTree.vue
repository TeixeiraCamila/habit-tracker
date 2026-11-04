<script setup lang="ts">
import { TreeGroup } from '@renderer/types/tree'
import { ref } from 'vue'

const props = defineProps<{
  groups: TreeGroup[]
  selectedHabitId?: number | null
}>()

defineEmits<{
  'select-habit': [habitId: number]
  'context-menu': [payload: { kind: 'group' | 'habit'; id: number; event: MouseEvent }]
}>()

const expanded = ref(new Set<number>(props.groups.map((g) => g.id)))
function toggleGroup(groupId: number): void {
  if (expanded.value.has(groupId)) expanded.value.delete(groupId)
  else expanded.value.add(groupId)
}

defineExpose({
  collapseAll: () => expanded.value.clear(),
  expandAll: () => (expanded.value = new Set(props.groups.map((g) => g.id)))
})
</script>

<template>
  <nav class="sidebar-tree" aria-label="Grupos e hábitos">
    <div v-for="group in groups" :key="group.id" class="sidebar-tree__group">
      <GroupRow
        :name="group.name"
        :color="group.color"
        :icon="group.icon"
        :expanded="expanded.has(group.id)"
        @toggle="toggleGroup(group.id)"
        @context-menu="$emit('context-menu', { kind: 'group', id: group.id, event: $event })"
      />

      <div
        :class="{ open: expanded.has(group.id) }"
        class="sidebar-tree__children"
        :inert="!expanded.has(group.id)"
      >
        <div class="collapse-inner">
          <TreeGuide :color="group.color">
            <HabitRow
              v-for="habit in group.habits"
              :key="habit.id"
              :name="habit.name"
              :icon="habit.icon"
              :selected="habit.id === selectedHabitId"
              @select="$emit('select-habit', habit.id)"
              @context-menu="$emit('context-menu', { kind: 'habit', id: habit.id, event: $event })"
            />
          </TreeGuide>
        </div>
      </div>
    </div>

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
