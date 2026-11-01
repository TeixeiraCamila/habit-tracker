<script setup lang="ts">
import { computed, useId } from 'vue'

const defaultColors = [
  { name: 'Laranja', color: 'var(--group-orange)', background: 'var(--group-orange-bg)' },
  { name: 'Amarelo', color: 'var(--group-yellow)', background: 'var(--group-yellow-bg)' },
  { name: 'Verde', color: 'var(--group-green)', background: 'var(--group-green-bg)' },
  { name: 'Vermelho', color: 'var(--group-red)', background: 'var(--group-red-bg)' }
]

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    colors?: Array<{ name: string; color: string; background: string }>
  }>(),
  { label: 'Cor' }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const uid = useId()
const groupName = `color-picker-${uid}`
const options = computed(() => props.colors ?? defaultColors)
</script>

<template>
  <fieldset class="color-picker">
    <legend class="color-picker__label">{{ label }}</legend>

    <div class="color-picker__options">
      <label
        v-for="option in options"
        :key="option.color"
        class="color-picker__option"
        :style="{ '--swatch-color': option.color, '--swatch-bg': option.background }"
        :title="option.name"
      >
        <input
          class="color-picker__input"
          type="radio"
          :name="groupName"
          :value="option.color"
          :checked="modelValue === option.color"
          :aria-label="option.name"
          @change="emit('update:modelValue', option.color)"
        />
        <span class="color-picker__swatch" aria-hidden="true" />
      </label>
    </div>
  </fieldset>
</template>

<style scoped>
.color-picker {
  min-width: 0;
  padding: 0;
  border: 0;
}

.color-picker__label {
  margin-bottom: var(--space-2);
  padding: 0;
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.color-picker__options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.color-picker__option {
  position: relative;
  cursor: pointer;
}

.color-picker__input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.color-picker__swatch {
  display: block;
  width: 32px;
  height: 32px;
  background: var(--swatch-bg);
  border: 2px solid var(--swatch-color);
  border-radius: var(--radius-pill);
  transition: transform var(--motion-fast) var(--ease-out);
}

.color-picker__option:hover .color-picker__swatch {
  transform: scale(1.06);
}

.color-picker__input:checked + .color-picker__swatch {
  box-shadow:
    0 0 0 2px var(--surface),
    0 0 0 3px var(--swatch-color);
}

.color-picker__input:focus-visible + .color-picker__swatch {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
</style>
