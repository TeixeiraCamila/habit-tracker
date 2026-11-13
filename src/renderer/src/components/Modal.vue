<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import IconButton from './IconButton.vue'

const props = defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLElement | null>(null)
const titleId = `modal-title-${useId()}`
let previousFocus: HTMLElement | null = null

function focusableElements(): HTMLElement[] {
  if (!dialog.value) return []
  return Array.from(
    dialog.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  )
}

// Fecha no Esc e mantém o Tab circulando dentro do diálogo.
function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    emit('close')
    return
  }
  if (event.key !== 'Tab' || !dialog.value) return

  const items = focusableElements()
  if (items.length === 0) {
    event.preventDefault()
    dialog.value.focus()
    return
  }

  const first = items[0]
  const last = items[items.length - 1]
  const current = document.activeElement

  if (event.shiftKey && (current === first || current === dialog.value)) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && current === last) {
    event.preventDefault()
    first?.focus()
  }
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      previousFocus = document.activeElement as HTMLElement | null
      window.addEventListener('keydown', onKeydown)
      await nextTick()
      dialog.value?.focus()
    } else {
      window.removeEventListener('keydown', onKeydown)
      previousFocus?.focus()
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  previousFocus?.focus()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal-backdrop" @click.self="emit('close')">
      <section
        ref="dialog"
        class="modal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
      >
        <header class="modal__header">
          <h2 :id="titleId" class="modal__title">{{ title }}</h2>
          <IconButton icon="x" label="Fechar" @click="emit('close')" />
        </header>

        <div class="modal__body"><slot /></div>

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
  width: min(600px, 100%);
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
  justify-content: space-between;
  margin-top: var(--space-6);
}
</style>
