<script setup lang="ts">
import AppIcon from './AppIcon.vue'

withDefaults(
  defineProps<{
    icon: string
    label: string
    active?: boolean
    disabled?: boolean
  }>(),
  {
    active: false,
    disabled: false
  }
)

const emit = defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
    class="icon-button"
    :class="{ 'is-active': active }"
    type="button"
    :aria-label="label"
    :aria-pressed="active"
    :title="label"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <AppIcon :name="icon" />
  </button>
</template>

<style scoped>
.icon-button {
  display: inline-grid;
  flex-shrink: 0;
  place-items: center;
  width: 36px;
  height: 36px;
  color: var(--text-muted);
  border-radius: var(--radius-pill);
  transition:
    color var(--motion-fast) var(--ease-out),
    background-color var(--motion-fast) var(--ease-out);
}

.icon-button:hover:not(:disabled) {
  color: var(--text-title);
  background: var(--surface);
}

.icon-button.is-active {
  color: var(--text-title);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.icon-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
</style>
