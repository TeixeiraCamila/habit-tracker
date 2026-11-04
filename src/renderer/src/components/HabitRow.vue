<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '@renderer/icons'

const props = defineProps<{ name: string; icon: string; selected: boolean }>()

defineEmits<{
  select: []
  'context-menu': [event: MouseEvent]
}>()

const Icon = computed(() => getIcon(props.icon))
</script>

<template>
  <div
    class="habit-row"
    :class="{ 'is-selected': selected }"
    @contextmenu.prevent="$emit('context-menu', $event)"
  >
    <button class="habit-row__main" type="button" :aria-pressed="selected" @click="$emit('select')">
      <span class="habit-row__icon" aria-hidden="true">
        <component :is="Icon" :size="20" :stroke-width="1.75" />
      </span>
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
  transition:
    background var(--motion-fast) var(--ease-out),
    box-shadow var(--motion-fast) var(--ease-out);
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
  background: color-mix(in srgb, var(--surface) 60%, transparent);
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
