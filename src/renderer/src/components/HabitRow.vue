<script setup lang="ts">
import AppIcon from './AppIcon.vue'

defineProps<{
  name: string
  icon: string
  selected: boolean
}>()

const emit = defineEmits<{ select: []; 'context-menu': [event: MouseEvent] }>()
</script>

<template>
  <div
    class="habit-row"
    :class="{ 'is-selected': selected }"
    @contextmenu.prevent="emit('context-menu', $event)"
  >
    <button class="habit-row__main" type="button" :aria-pressed="selected" @click="emit('select')">
      <span class="habit-row__icon" aria-hidden="true"><AppIcon :name="icon" /></span>
      <span class="habit-row__name">{{ name }}</span>
    </button>

    <div v-if="$slots.trailing" class="habit-row__trailing">
      <slot name="trailing" />
    </div>
  </div>
</template>

<style scoped>
.habit-row {
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
}

.habit-row.is-selected {
  background: var(--surface);
  border-color: var(--surface-border);
  box-shadow: var(--shadow);
}

.habit-row__main {
  display: flex;
  flex: 1;
  gap: var(--space-2);
  align-items: center;
  min-width: 0;
  min-height: var(--row-height);
  padding: 0 var(--space-4);
  text-align: left;
  border-radius: var(--radius-md);
}

.habit-row__main:hover {
  background: rgba(74, 53, 32, 0.04);
}

.habit-row__icon {
  display: inline-flex;
  flex-shrink: 0;
  color: var(--text-muted);
}

.habit-row.is-selected .habit-row__icon {
  color: var(--text-title);
}

.habit-row__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: var(--text-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.habit-row.is-selected .habit-row__name {
  font-weight: 700;
  color: var(--text-title);
}

.habit-row__trailing {
  display: flex;
  align-items: center;
  padding-right: var(--space-2);
}
</style>
