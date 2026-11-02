<script setup lang="ts">
import { useId } from 'vue'
import AppIcon from './AppIcon.vue'

const labels: Record<string, string> = {
  star: 'Estrela',
  sun: 'Sol',
  coffee: 'Café',
  music: 'Música',
  pencil: 'Lápis',
  moon: 'Lua',
  heart: 'Coração',
  check: 'Check',
  droplets: 'Gotas',
  'book-open': 'Livro',
  dumbbell: 'Haltere',
  leaf: 'Folha'
}

withDefaults(
  defineProps<{
    modelValue: string
    icons?: string[]
  }>(),
  {
    icons: () => ['star', 'sun', 'coffee', 'music', 'pencil', 'moon', 'heart', 'check']
  }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const groupName = `icon-picker-${useId()}`

function labelFor(icon: string): string {
  return labels[icon] ?? icon
}
</script>

<template>
  <fieldset class="icon-picker">
    <legend class="icon-picker__label">Ícone</legend>

    <div class="icon-picker__options">
      <label v-for="icon in icons" :key="icon" class="icon-picker__option" :title="labelFor(icon)">
        <input
          class="icon-picker__input"
          type="radio"
          :name="groupName"
          :value="icon"
          :checked="modelValue === icon"
          :aria-label="labelFor(icon)"
          @change="emit('update:modelValue', icon)"
        />
        <span class="icon-picker__icon">
          <AppIcon :name="icon" />
        </span>
      </label>
    </div>
  </fieldset>
</template>

<style scoped>
.icon-picker {
  min-width: 0;
  padding: 0;
  border: 0;
}

.icon-picker__label {
  margin-bottom: var(--space-2);
  padding: 0;
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.icon-picker__options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.icon-picker__option {
  position: relative;
  cursor: pointer;
}

.icon-picker__input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.icon-picker__icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  transition:
    color var(--motion-fast) var(--ease-out),
    border-color var(--motion-fast) var(--ease-out);
}

.icon-picker__option:hover .icon-picker__icon {
  color: var(--text-title);
  border-color: var(--text-muted);
}

.icon-picker__input:checked + .icon-picker__icon {
  color: var(--text-title);
  border-color: var(--text-title);
  box-shadow: var(--shadow);
}

.icon-picker__input:focus-visible + .icon-picker__icon {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
</style>
