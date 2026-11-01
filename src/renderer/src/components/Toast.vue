<script setup lang="ts">
withDefaults(
  defineProps<{
    visible: boolean
    message: string
    type?: 'info' | 'success' | 'error'
  }>(),
  { type: 'info' }
)

defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="visible" class="toast" :class="`toast--${type}`" role="status" aria-live="polite">
        <span class="toast__message">{{ message }}</span>
        <button
          class="toast__close"
          type="button"
          aria-label="Fechar aviso"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: var(--space-6);
  left: 50%;
  z-index: 60;
  display: flex;
  gap: var(--space-4);
  align-items: center;
  max-width: min(420px, calc(100vw - 48px));
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  color: var(--text-title);
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-left: 4px solid var(--text-muted);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
  transform: translateX(-50%);
}

.toast--success {
  border-left-color: var(--group-green);
}

.toast--error {
  border-left-color: var(--group-red);
}

.toast__message {
  flex: 1;
}

.toast__close {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 24px;
  height: 24px;
  color: var(--text-muted);
  border-radius: var(--radius-pill);
}

.toast__close:hover {
  color: var(--text-title);
  background: var(--bg);
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity var(--motion-base) var(--ease-out),
    transform var(--motion-base) var(--ease-out);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, var(--space-2));
}
</style>
