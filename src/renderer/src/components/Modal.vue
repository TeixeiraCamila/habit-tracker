<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import IconButton from './IconButton.vue'

const props = withDefaults(defineProps<{ open: boolean; title?: string }>(), { title: '' })

const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLElement | null>(null)

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') emit('close')
}

// Escuta o Esc só enquanto o modal está aberto e leva o foco para o diálogo.
watch(
  () => props.open,
  async (open) => {
    if (open) {
      window.addEventListener('keydown', onKeydown)
      await nextTick()
      dialog.value?.focus()
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal-backdrop" @click.self="emit('close')">
      <section
        ref="dialog"
        class="modal"
        role="dialog"
        aria-modal="true"
        :aria-label="title || undefined"
        tabindex="-1"
      >
        <header class="modal__header">
          <slot name="header">
            <h2 v-if="title" class="modal__title">{{ title }}</h2>
          </slot>
          <IconButton label="Fechar" size="sm" @click="emit('close')">✕</IconButton>
        </header>

        <div class="modal__body">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="modal__footer">
          <slot name="footer" />
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  background: rgba(74, 53, 32, 0.32);
}

.modal {
  width: min(480px, 100%);
  max-height: 100%;
  padding: var(--space-6);
  overflow: auto;
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
}

.modal__header {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.modal__title {
  font-size: var(--text-lg);
}

.modal__body {
  font-size: var(--text-sm);
}

.modal__footer {
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
  margin-top: var(--space-6);
}
</style>
