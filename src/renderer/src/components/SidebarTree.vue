<script setup lang="ts">
import type { Group, Habit } from '@shared/types'
import { computed, reactive, ref, watch } from 'vue'
import GroupRow from './GroupRow.vue'
import HabitRow from './HabitRow.vue'
import StarDivider from './StarDivider.vue'
import TreeGuide from './TreeGuide.vue'

const props = defineProps<{
  groups: Group[]
  habits: Habit[]
  selectedHabitId: number | null
}>()

const emit = defineEmits<{
  'select-habit': [habitId: number]
  'toggle-group': [groupId: number]
  reorder: [payload: { habitId: number; targetId: number }]
  'context-menu': [payload: { kind: 'group' | 'habit'; id: number; event: MouseEvent }]
}>()

// Grupos novos entram expandidos; os já conhecidos mantêm o estado escolhido.
const expanded = reactive(new Set<number>())
const knownGroups = new Set<number>()

watch(
  () => props.groups.map((group) => group.id),
  (ids) => {
    for (const id of ids) {
      if (!knownGroups.has(id)) {
        knownGroups.add(id)
        expanded.add(id)
      }
    }
  },
  { immediate: true }
)

const ungroupedHabits = computed(() => props.habits.filter((habit) => habit.groupId === null))

function habitsOf(groupId: number): Habit[] {
  return props.habits.filter((habit) => habit.groupId === groupId)
}

function toggleGroup(groupId: number): void {
  if (expanded.has(groupId)) expanded.delete(groupId)
  else expanded.add(groupId)
  emit('toggle-group', groupId)
}

const draggingHabitId = ref<number | null>(null)

// Reordenação simples: arrastar um hábito e soltar sobre outro emite os dois ids.
function onDragStart(habit: Habit, event: DragEvent): void {
  draggingHabitId.value = habit.id
  event.dataTransfer?.setData('text/plain', String(habit.id))
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function onDrop(target: Habit): void {
  const source = draggingHabitId.value
  draggingHabitId.value = null
  if (source !== null && source !== target.id) {
    emit('reorder', { habitId: source, targetId: target.id })
  }
}
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
        @context-menu="emit('context-menu', { kind: 'group', id: group.id, event: $event })"
      />

      <div
        v-if="expanded.has(group.id) && habitsOf(group.id).length"
        class="sidebar-tree__children"
      >
        <TreeGuide :color="`var(--group-${group.color})`">
          <div
            v-for="habit in habitsOf(group.id)"
            :key="habit.id"
            draggable="true"
            @dragstart="onDragStart(habit, $event)"
            @dragover.prevent
            @drop="onDrop(habit)"
          >
            <HabitRow
              :name="habit.name"
              :icon="habit.icon"
              :selected="habit.id === selectedHabitId"
              @select="emit('select-habit', habit.id)"
              @context-menu="emit('context-menu', { kind: 'habit', id: habit.id, event: $event })"
            />
          </div>
        </TreeGuide>
      </div>
    </div>

    <div v-if="ungroupedHabits.length" class="sidebar-tree__group">
      <p class="sidebar-tree__label">Sem grupo</p>
      <TreeGuide color="var(--surface-border)">
        <div
          v-for="habit in ungroupedHabits"
          :key="habit.id"
          draggable="true"
          @dragstart="onDragStart(habit, $event)"
          @dragover.prevent
          @drop="onDrop(habit)"
        >
          <HabitRow
            :name="habit.name"
            :icon="habit.icon"
            :selected="habit.id === selectedHabitId"
            @select="emit('select-habit', habit.id)"
            @context-menu="emit('context-menu', { kind: 'habit', id: habit.id, event: $event })"
          />
        </div>
      </TreeGuide>
    </div>

    <p v-if="!groups.length && !ungroupedHabits.length" class="sidebar-tree__empty">
      Nenhum grupo ou hábito ainda.
    </p>

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
</style>
