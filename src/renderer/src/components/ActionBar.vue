<script setup lang="ts">
import { ACTION_ITEMS, type ActionKey } from './actions'
import IconButton from './IconButton.vue'

withDefaults(defineProps<{ activeAction?: ActionKey | null }>(), { activeAction: null })

const emit = defineEmits<{
  'new-habit': []
  'new-group': []
  sort: []
  'toggle-view': []
  'collapse-all': []
}>()

function run(key: ActionKey): void {
  if (key === 'new-habit') emit('new-habit')
  else if (key === 'new-group') emit('new-group')
  else if (key === 'sort') emit('sort')
  else if (key === 'toggle-view') emit('toggle-view')
  else emit('collapse-all')
}
</script>

<template>
  <footer class="action-bar" role="toolbar" aria-label="Ações">
    <div class="action-bar__group">
      <IconButton
        v-for="action in ACTION_ITEMS"
        :key="action.key"
        :icon="action.icon"
        :label="action.label"
        :active="activeAction === action.key"
        @click="run(action.key)"
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
</style>
