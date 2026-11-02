<script setup lang="ts">
import type { GroupColor } from '@shared/types'
import AppIcon from './AppIcon.vue'
import { groupColorStyle } from './groupColors'

defineProps<{
  name: string
  color: GroupColor
  icon: string
  expanded: boolean
}>()

const emit = defineEmits<{ toggle: []; 'context-menu': [event: MouseEvent] }>()
</script>

<template>
  <div
    class="group-row"
    :style="groupColorStyle(color)"
    @contextmenu.prevent="emit('context-menu', $event)"
  >
    <button class="group-row__main" type="button" :aria-expanded="expanded" @click="emit('toggle')">
      <span class="group-row__chevron" :class="{ 'is-expanded': expanded }" aria-hidden="true">
        <AppIcon name="chevron-down" :size="14" />
      </span>
      <span class="group-row__icon"><AppIcon :name="icon" /></span>
      <span class="group-row__name">{{ name }}</span>
    </button>
  </div>
</template>

<style scoped>
.group-row {
  display: flex;
  align-items: center;
  min-height: var(--row-height);
  color: var(--group-color);
  background: var(--group-bg);
  border-radius: var(--radius-md);
}

.group-row__main {
  display: flex;
  flex: 1;
  gap: var(--space-2);
  align-items: center;
  min-width: 0;
  min-height: var(--row-height);
  padding: 0 var(--space-4);
  color: inherit;
  text-align: left;
  border-radius: var(--radius-md);
}

.group-row__main:hover {
  background: rgba(74, 53, 32, 0.05);
}

.group-row__chevron {
  display: inline-flex;
  flex: 0 0 auto;
  color: var(--text-muted);
  transition: transform var(--motion-fast) var(--ease-out);
  transform: rotate(-90deg);
}

.group-row__chevron.is-expanded {
  transform: rotate(0deg);
}

.group-row__icon {
  display: inline-flex;
  flex-shrink: 0;
  color: inherit;
}

.group-row__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: var(--text-sm);
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
