<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import IconButton from './IconButton.vue'

const props = withDefaults(
  defineProps<{
    message: string
    kind?: 'success' | 'error'
    duration?: number
  }>(),
  {
    kind: 'success',
    duration: 4000
  }
)

const emit = defineEmits<{ dismiss: [] }>()

let timer: ReturnType<typeof setTimeout> | undefined

function clearTimer(): void {
  if (timer !== undefined) {
    clearTimeout(timer)
    timer = undefined
  }
}

// Cada nova mensagem reinicia a contagem que fecha o toast sozinho.
watch(
  () => [props.message, props.duration] as const,
  ([message, duration]) => {
    clearTimer()
    if (message && duration > 0) timer = setTimeout(() => emit('dismiss'), duration)
  },
  { immediate: true }
)

onBeforeUnmount(clearTimer)
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="message"
        class="toast"
        :class="`toast--${kind}`"
        :role="kind === 'error' ? 'alert' : 'status'"
        aria-live="polite"
      >
        <AppIcon :name="kind === 'error' ? 'alert-circle' : 'check'" :size="18" />
        <span class="toast__message">{{ message }}</span>
        <IconButton icon="x" label="Fechar aviso" @click="emit('dismiss')" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast {
  position: fixed;
  right: var(--space-6);
  bottom: var(--space-6);
  z-index: 60;
  display: flex;
  gap: var(--space-3);
  align-items: center;
  max-width: min(420px, calc(100vw - 48px));
  padding: var(--space-2) var(--space-2) var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  color: var(--text-title);
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-left: 4px solid var(--group-green);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
}

.toast--error {
  border-left-color: var(--group-red);
}

.toast__message {
  flex: 1;
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
  transform: translateY(var(--space-2));
}
</style>
