<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    active?: boolean
    disabled?: boolean
    size?: 'sm' | 'md'
  }>(),
  {
    active: false,
    disabled: false,
    size: 'md'
  }
)

defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
    class="icon-button"
    :class="[`icon-button--${size}`, { 'is-active': active }]"
    type="button"
    :aria-label="label"
    :aria-pressed="active"
    :title="label"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.icon-button {
  display: inline-grid;
  flex-shrink: 0;
  place-items: center;
  color: var(--text-muted);
  border-radius: var(--radius-pill);
  transition:
    color var(--motion-fast) var(--ease-out),
    background-color var(--motion-fast) var(--ease-out);
}

.icon-button--md {
  width: 36px;
  height: 36px;
}

.icon-button--sm {
  width: 28px;
  height: 28px;
}

.icon-button:hover:not(:disabled) {
  color: var(--text-title);
  background: var(--surface);
}

.icon-button.is-active {
  color: var(--text-title);
  background: var(--surface);
}

.icon-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
</style>
