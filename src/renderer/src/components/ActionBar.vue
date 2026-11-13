<script setup lang="ts">
import { computed } from 'vue'
import { ACTION_ITEMS, type ActionItem, type ActionKey } from './actions'
import IconButton from './IconButton.vue'
import type { Habit } from '@shared/types'

const props = withDefaults(
  defineProps<{
    activeAction?: ActionKey | null
    selectedHabit?: Habit | null
  }>(),
  { activeAction: null, selectedHabit: null }
)

const emit = defineEmits<{
  'new-habit': []
  'new-group': []
  sort: []
  'toggle-view': []
  'collapse-all': []
  'edit-habit': [habit: Habit]
}>()

const editingHabit = computed<Habit | null>(() => props.selectedHabit)
const isEditing = computed(() => props.selectedHabit != null)

const actions = computed<ActionItem[]>(() =>
  ACTION_ITEMS.map((action) =>
    action.key === 'new-habit' && isEditing.value
      ? { ...action, key: 'edit-habit', label: 'Editar hábito', icon: 'pencil' }
      : action
  )
)

function run(action: ActionItem): void {
  switch (action.key) {
    case 'new-habit':
      emit('new-habit')
      break
    case 'new-group':
      emit('new-group')
      break
    case 'sort':
      emit('sort')
      break
    case 'toggle-view':
      emit('toggle-view')
      break
    case 'collapse-all':
      emit('collapse-all')
      break
    case 'edit-habit':
      if (editingHabit.value) emit('edit-habit', editingHabit.value)
      break
  }
}
</script>

<template>
  <footer class="action-bar" role="toolbar" aria-label="Ações">
    <div class="action-bar__group">
      <IconButton
        v-for="action in actions"
        :key="action.key"
        :icon="action.icon"
        :label="action.label"
        :active="activeAction === action.key"
        :class="{ 'is-edit': action.key === 'edit-habit' }"
        @click="run(action)"
      />
    </div>
  </footer>
</template>

<style scoped>
.action-bar {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-2) var(--space-4);
  background: var(--bg);
  border-top: 1px solid var(--surface-border);
}

.action-bar__group {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

.action-bar .icon-button.is-edit {
  background: transparent;
  border: 1px solid var(--text-muted);
  box-shadow: none;
}
</style>
