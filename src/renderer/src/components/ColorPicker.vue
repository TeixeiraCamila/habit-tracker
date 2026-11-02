<script setup lang="ts">
import type { GroupColor } from '@shared/types'
import { useId } from 'vue'
import { GROUP_COLORS, groupColorStyle } from './groupColors'

defineProps<{ modelValue: GroupColor }>()

const emit = defineEmits<{ 'update:modelValue': [value: GroupColor] }>()

const groupName = `color-picker-${useId()}`
</script>

<template>
  <fieldset class="color-picker">
    <legend class="color-picker__label">Cor</legend>

    <div class="color-picker__options">
      <label
        v-for="option in GROUP_COLORS"
        :key="option.key"
        class="color-picker__option"
        :style="groupColorStyle(option.key)"
        :title="option.label"
      >
        <input
          class="color-picker__input"
          type="radio"
          :name="groupName"
          :value="option.key"
          :checked="modelValue === option.key"
          :aria-label="option.label"
          @change="emit('update:modelValue', option.key)"
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
  background: var(--group-bg);
  border: 2px solid var(--group-color);
  border-radius: var(--radius-pill);
  transition: transform var(--motion-fast) var(--ease-out);
}

.color-picker__option:hover .color-picker__swatch {
  transform: scale(1.06);
}

.color-picker__input:checked + .color-picker__swatch {
  box-shadow:
    0 0 0 2px var(--surface),
    0 0 0 3px var(--group-color);
}

.color-picker__input:focus-visible + .color-picker__swatch {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
</style>
