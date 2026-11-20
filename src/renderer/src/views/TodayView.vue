<script setup lang="ts">
// Tela Hoje: check-in rápido dos hábitos devidos, agrupados por grupo.
import { computed, onMounted } from 'vue'
import CheckInRow from '@renderer/components/CheckInRow.vue'
import EmptyState from '@renderer/components/EmptyState.vue'
import IconButton from '@renderer/components/IconButton.vue'
import { groupColorStyle } from '@renderer/components/groupColors'
import { useDate } from '@renderer/composables/useDate'
import { useToast } from '@renderer/composables/useToast'
import { useGroupsStore } from '@renderer/stores/groups'
import { useTodayStore, type DueHabit } from '@renderer/stores/today'
import { errorMessage } from '@renderer/utils/errors'
import type { GroupColor, Habit } from '@shared/types'

interface Section {
  key: string
  name: string
  color: GroupColor
  items: DueHabit[]
}

const todayStore = useTodayStore()
const groupsStore = useGroupsStore()
const { formatDay, formatFullDate } = useDate()
const { error } = useToast()

const sections = computed<Section[]>(() => {
  const result = new Map<string, Section>()
  for (const entry of todayStore.due) {
    const group = groupsStore.items.find((g) => g.id === entry.habit.groupId)
    const key = group ? `group-${group.id}` : 'ungrouped'
    if (!result.has(key)) {
      result.set(key, {
        key,
        name: group?.name ?? 'Sem grupo',
        color: group?.color ?? 'orange',
        items: []
      })
    }
    result.get(key)!.items.push(entry)
  }
  return [...result.values()]
})

const percent = computed(() =>
  todayStore.due.length === 0 ? 0 : Math.round((todayStore.doneCount / todayStore.due.length) * 100)
)

async function run(task: () => Promise<unknown>): Promise<void> {
  try {
    await task()
  } catch (cause) {
    error(errorMessage(cause))
  }
}

function toggle(habit: Habit): Promise<void> {
  return run(() => todayStore.toggle(habit))
}

function setCounter(habit: Habit, value: number): Promise<void> {
  return run(() => todayStore.setCounter(habit, value))
}

onMounted(() => void run(() => todayStore.load()))
</script>

<template>
  <div class="today">
    <header class="today__header">
      <div>
        <p class="today__eyebrow">{{ todayStore.isToday ? 'Hoje' : 'Outro dia' }}</p>
        <h1 class="today__title">{{ formatDay(todayStore.date) }}</h1>
        <p class="today__date">{{ formatFullDate(todayStore.date) }}</p>
      </div>

      <nav class="today__nav" aria-label="Navegar entre dias">
        <IconButton icon="chevron-left" label="Dia anterior" @click="todayStore.previousDay()" />
        <button
          class="today__today-button"
          type="button"
          :disabled="todayStore.isToday"
          @click="todayStore.goToToday()"
        >
          Hoje
        </button>
        <IconButton
          icon="chevron-right"
          label="Próximo dia"
          :disabled="!todayStore.canGoNext"
          @click="todayStore.nextDay()"
        />
      </nav>
    </header>

    <div class="today__progress" role="status">
      <span>{{ todayStore.doneCount }} de {{ todayStore.due.length }} concluídos</span>
      <span class="today__progress-track" aria-hidden="true">
        <span class="today__progress-fill" :style="{ width: `${percent}%` }" />
      </span>
    </div>

    <p v-if="todayStore.loading" class="today__loading">Carregando…</p>

    <EmptyState
      v-else-if="todayStore.due.length === 0"
      icon="check"
      title="Nada para marcar"
      :description="
        todayStore.isToday
          ? 'Nenhum hábito devido hoje. Aproveite o dia.'
          : 'Nenhum hábito devido neste dia.'
      "
    />

    <template v-else>
      <section v-for="section in sections" :key="section.key" class="today__section">
        <h2 class="today__section-title" :style="groupColorStyle(section.color)">
          {{ section.name }}
        </h2>
        <div class="today__rows">
          <CheckInRow
            v-for="entry in section.items"
            :key="entry.habit.id"
            :habit="entry.habit"
            :completion="entry.completion"
            :color="section.color"
            @toggle="toggle(entry.habit)"
            @set-value="setCounter(entry.habit, $event)"
          />
        </div>
      </section>

      <p v-if="todayStore.allDone" class="today__all-done">*.☆.☽.☆.* Tudo feito por hoje.</p>
    </template>
  </div>
</template>

<style scoped>
.today {
  max-width: 860px;
  margin: 0 auto;
}

.today__header {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
  justify-content: space-between;
}

.today__eyebrow {
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-transform: uppercase;
}

.today__title {
  margin-top: var(--space-1);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-title);
}

.today__date {
  margin-top: var(--space-1);
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.today__nav {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

.today__today-button {
  min-height: 36px;
  padding: 0 var(--space-3);
  font-size: var(--text-sm);
  color: var(--text-title);
  background: var(--bg);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-pill);
}

.today__today-button:disabled {
  cursor: default;
  opacity: 0.5;
}

.today__progress {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: var(--space-6) 0;
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.today__progress-track {
  height: 6px;
  overflow: hidden;
  background: var(--bg);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-pill);
}

.today__progress-fill {
  display: block;
  height: 100%;
  background: var(--group-green);
  transition: width var(--motion-base) var(--ease-out);
}

.today__loading {
  font-size: var(--text-sm);
  color: var(--text-muted);
  text-align: center;
}

.today__section + .today__section {
  margin-top: var(--space-6);
}

.today__section-title {
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--group-color);
}

.today__rows {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.today__all-done {
  margin-top: var(--space-6);
  font-size: var(--text-sm);
  color: var(--text-muted);
  text-align: center;
}
</style>
