<script setup lang="ts">
// Uma linha de check-in: alterna booleanos e ajusta contadores do dia.
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'
import { groupColorStyle } from './groupColors'
import { isCompleted } from '@shared/due'
import type { Completion, GroupColor, Habit } from '@shared/types'

const props = defineProps<{
  habit: Habit
  completion?: Completion
  color: GroupColor
  streak?: number
}>()

const emit = defineEmits<{
  toggle: []
  'set-value': [value: number]
}>()

const done = computed(() => isCompleted(props.habit, props.completion))
const progress = computed(() =>
  props.habit.kind === 'counter'
    ? Math.min(100, Math.round(((props.completion?.value ?? 0) / props.habit.target) * 100))
    : done.value
      ? 100
      : 0
)
</script>

<template>
  <div
    class="checkin-row"
    :style="groupColorStyle(color)"
    :class="{ 'is-done': done }"
    :data-habit-id="habit.id"
  >
    <button
      v-if="habit.kind === 'boolean'"
      class="checkin-check"
      type="button"
      role="checkbox"
      :aria-checked="done"
      :aria-label="habit.name"
      @click="emit('toggle')"
    >
      <AppIcon v-if="done" name="check" :size="16" />
    </button>

    <div v-else class="checkin-counter">
      <button
        class="checkin-counter__button"
        type="button"
        :aria-label="`Diminuir ${habit.name}`"
        :disabled="(completion?.value ?? 0) === 0"
        @click="emit('set-value', (completion?.value ?? 0) - 1)"
      >
        <AppIcon name="minus" :size="14" />
      </button>
      <span class="checkin-counter__value" aria-live="polite">
        {{ completion?.value ?? 0 }} / {{ habit.target }}
      </span>
      <button
        class="checkin-counter__button"
        type="button"
        :aria-label="`Aumentar ${habit.name}`"
        :disabled="(completion?.value ?? 0) >= habit.target"
        @click="emit('set-value', (completion?.value ?? 0) + 1)"
      >
        <AppIcon name="plus" :size="14" />
      </button>
      <span class="checkin-counter__track" aria-hidden="true">
        <span class="checkin-counter__fill" :style="{ width: `${progress}%` }" />
      </span>
    </div>

    <div class="checkin-row__body">
      <span class="checkin-row__name">{{ habit.name }}</span>
      <span v-if="habit.unit" class="checkin-row__unit">{{ habit.unit }}</span>
    </div>

    <span class="checkin-row__streak" aria-hidden="true">
      <template v-if="streak !== undefined && streak > 0">
        <AppIcon name="flame" :size="14" />
        {{ streak }}
      </template>
    </span>
  </div>
</template>

<style scoped>
.checkin-row {
  --group-color: var(--group-orange);
  --group-bg: var(--group-orange-bg);

  display: flex;
  gap: var(--space-3);
  align-items: center;
  min-height: 52px;
  padding: var(--space-2) var(--space-3);
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  transition:
    background var(--motion-fast) var(--ease-out),
    border-color var(--motion-fast) var(--ease-out);
}

.checkin-row.is-done {
  background: var(--group-bg);
  border-color: var(--group-color);
}

.checkin-check {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 26px;
  height: 26px;
  padding: 0;
  color: var(--surface);
  background: transparent;
  border: 2px solid var(--group-color);
  border-radius: 50%;
  transition:
    background var(--motion-fast) var(--ease-out),
    transform var(--motion-fast) var(--ease-out);
}

.checkin-check:hover {
  transform: scale(1.08);
}

.checkin-check[aria-checked='true'] {
  background: var(--group-color);
}

.checkin-counter {
  position: relative;
  display: flex;
  flex-shrink: 0;
  gap: var(--space-1);
  align-items: center;
  padding-bottom: var(--space-2);
}

.checkin-counter__button {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  padding: 0;
  color: var(--group-color);
  background: var(--group-bg);
  border: 1px solid var(--group-color);
  border-radius: var(--radius-pill);
}

.checkin-counter__button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.checkin-counter__value {
  min-width: 52px;
  font-size: var(--text-xs);
  color: var(--text-title);
  text-align: center;
}

.checkin-counter__track {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 3px;
  overflow: hidden;
  background: var(--surface-border);
  border-radius: var(--radius-pill);
}

.checkin-counter__fill {
  display: block;
  height: 100%;
  background: var(--group-color);
  transition: width var(--motion-base) var(--ease-out);
}

.checkin-row__body {
  display: flex;
  flex: 1;
  gap: var(--space-2);
  align-items: baseline;
  min-width: 0;
}

.checkin-row__name {
  overflow: hidden;
  font-size: var(--text-sm);
  color: var(--text-title);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.checkin-row__unit {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.checkin-row__streak {
  display: inline-flex;
  gap: var(--space-1);
  align-items: center;
  justify-content: flex-end;
  min-width: 34px;
  font-size: var(--text-xs);
  color: var(--group-color);
}
</style>
