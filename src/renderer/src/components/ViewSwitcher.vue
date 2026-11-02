<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    options?: string[]
  }>(),
  {
    options: () => ['Hoje', 'Semana', 'Mês', 'Estatísticas']
  }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const currentIndex = computed(() => Math.max(0, props.options.indexOf(props.modelValue)))

// As setas percorrem as opções em ciclo, inclusive do fim para o começo.
function step(offset: number): void {
  const total = props.options.length
  if (total === 0) return

  const next = props.options[(currentIndex.value + offset + total) % total]
  if (next) emit('update:modelValue', next)
}
</script>

<template>
  <div class="view-switcher" role="group" aria-label="Trocar visão">
    <span class="view-switcher__label">{{ modelValue }}</span>

    <div class="view-switcher__arrows">
      <button
        class="view-switcher__arrow"
        type="button"
        aria-label="Visão anterior"
        @click="step(-1)"
      >
        <AppIcon name="chevron-down" :size="13" class="view-switcher__icon--up" />
      </button>
      <button
        class="view-switcher__arrow"
        type="button"
        aria-label="Próxima visão"
        @click="step(1)"
      >
        <AppIcon name="chevron-down" :size="13" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.view-switcher {
  display: inline-flex;
  align-items: stretch;
  min-width: 180px;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
}

.view-switcher__label {
  display: flex;
  flex: 1;
  align-items: center;
  padding: 0 var(--space-4);
  font-size: var(--text-sm);
  color: var(--text-title);
}

.view-switcher__arrows {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--surface-border);
}

.view-switcher__arrow {
  display: grid;
  place-items: center;
  width: 32px;
  height: 22px;
  color: var(--text-muted);
  transition:
    color var(--motion-fast) var(--ease-out),
    background-color var(--motion-fast) var(--ease-out);
}

.view-switcher__arrow:hover {
  color: var(--text-title);
  background: var(--bg);
}

.view-switcher__arrow + .view-switcher__arrow {
  border-top: 1px solid var(--surface-border);
}

.view-switcher__icon--up {
  transform: rotate(180deg);
}
</style>
