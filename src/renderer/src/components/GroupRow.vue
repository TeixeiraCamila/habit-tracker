<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    color?: string
    background?: string
    expanded?: boolean
    count?: number
  }>(),
  {
    color: 'var(--group-orange)',
    background: 'var(--group-orange-bg)',
    expanded: false
  }
)

defineEmits<{ toggle: [] }>()
</script>

<template>
  <div class="group-row" :style="{ '--group-color': color, '--group-bg': background }">
    <button
      class="group-row__main"
      type="button"
      :aria-expanded="expanded"
      @click="$emit('toggle')"
    >
      <span class="group-row__chevron" :class="{ 'is-expanded': expanded }" aria-hidden="true">
        ▸
      </span>
      <span v-if="$slots.icon" class="group-row__icon"><slot name="icon" /></span>
      <span class="group-row__name">{{ name }}</span>
      <span v-if="count !== undefined" class="group-row__count">{{ count }}</span>
    </button>

    <div v-if="$slots.actions" class="group-row__actions">
      <slot name="actions" />
    </div>
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
  flex: 0 0 auto;
  font-size: var(--text-xs);
  color: var(--text-muted);
  transition: transform var(--motion-fast) var(--ease-out);
}

.group-row__chevron.is-expanded {
  transform: rotate(90deg);
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

.group-row__count {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.group-row__actions {
  display: flex;
  gap: var(--space-1);
  padding-right: var(--space-2);
}
</style>
