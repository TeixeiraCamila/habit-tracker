<script setup lang="ts">
import { computed, useId } from 'vue'

defineProps<{
  modelValue: string
  label: string
  error?: string
  placeholder?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const uid = useId()
const inputId = computed(() => `text-field-${uid}`)
const errorId = computed(() => `${inputId.value}-error`)

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="text-field" :class="{ 'has-error': Boolean(error) }">
    <label class="text-field__label" :for="inputId">{{ label }}</label>

    <input
      :id="inputId"
      class="text-field__input"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? errorId : undefined"
      @input="onInput"
    />

    <p v-if="error" :id="errorId" class="text-field__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.text-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.text-field__label {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.text-field__input {
  width: 100%;
  min-height: 40px;
  padding: 0 var(--space-3);
  color: var(--text-title);
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  transition: border-color var(--motion-fast) var(--ease-out);
}

.text-field__input::placeholder {
  color: var(--text-muted);
}

.has-error .text-field__input {
  border-color: var(--group-red);
}

.text-field__error {
  font-size: var(--text-xs);
  color: var(--group-red);
}
</style>
