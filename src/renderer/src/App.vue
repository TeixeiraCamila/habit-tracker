// App principal do renderer: monta a sidebar com header, seletor de visao e arvore de habitos.
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@renderer/components/AppHeader.vue'
import ViewSwitcher from '@renderer/components/ViewSwitcher.vue'
import SidebarTree from '@renderer/components/SidebarTree.vue'
import ActionBar from '@renderer/components/ActionBar.vue'
import Toast from '@renderer/components/Toast.vue'
import { useGroupsStore } from '@renderer/stores/groups'
import { useHabitsStore } from '@renderer/stores/habits'
import { useTree } from '@renderer/composables/useTree'
import { useToast } from '@renderer/composables/useToast'
import { errorMessage } from '@renderer/utils/errors'
import GroupFormModal from './components/GroupFormModal.vue'
import HabitFormModal from './components/HabitFormModal.vue'
import EmptyState from './components/EmptyState.vue'

import ContextMenu from '@renderer/components/ContextMenu.vue'
import type { MenuItem } from '@renderer/types/menu'
import type { Group, Habit } from '@shared/types'

const route = useRoute()
const router = useRouter()
const groupsStore = useGroupsStore()
const habitsStore = useHabitsStore()
const { treeGroups, ungrouped } = useTree()
const { toast, error, dismiss } = useToast()
const loaded = ref(false)
const isEmpty = computed(
  () => loaded.value && groupsStore.items.length === 0 && habitsStore.items.length === 0
)

const selectedHabitId = ref<number | null>(null)
const tree = ref<InstanceType<typeof SidebarTree> | null>(null)

const selectedHabit = computed<Habit | null>(
  () => habitsStore.items.find((habit) => habit.id === selectedHabitId.value) ?? null
)

const views = [
  { value: 'today', label: 'Hoje' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mês' },
  { value: 'stats', label: 'Estatísticas' }
]

const habitForm = reactive<{ open: boolean; habit: Habit | null }>({ open: false, habit: null })

function openHabitForm(habit: Habit | null = null): void {
  habitForm.open = true
  habitForm.habit = habit
}

const groupForm = reactive<{ open: boolean; group: Group | null }>({ open: false, group: null })

function openGroupForm(group: Group | null = null): void {
  groupForm.open = true
  groupForm.group = group
}

async function run(task: () => Promise<unknown>): Promise<void> {
  try {
    await task()
  } catch (e) {
    error(errorMessage(e))
  }
}

const menu = reactive<{ open: boolean; x: number; y: number; kind: 'group' | 'habit'; id: number }>(
  { open: false, x: 0, y: 0, kind: 'habit', id: 0 }
)

const menuItems = computed<MenuItem[]>(() =>
  menu.kind === 'group'
    ? [
        { key: 'edit', label: 'Editar grupo' },
        { key: 'delete', label: 'Excluir grupo', danger: true }
      ]
    : [
        { key: 'edit', label: 'Editar hábito' },
        { key: 'duplicate', label: 'Duplicar hábito' },
        { key: 'delete', label: 'Excluir hábito', danger: true }
      ]
)

function handleContextMenu(payload: {
  kind: 'group' | 'habit'
  id: number
  event: MouseEvent
}): void {
  Object.assign(menu, {
    open: true,
    x: payload.event.clientX,
    y: payload.event.clientY,
    kind: payload.kind,
    id: payload.id
  })
}

function removeGroup(group: Group): Promise<void> {
  if (!window.confirm(`Excluir o grupo "${group.name}"? Os hábitos dele ficam sem grupo.`)) {
    return Promise.resolve()
  }
  return run(() => groupsStore.remove(group.id))
}

function removeHabit(habit: Habit): Promise<void> {
  if (!window.confirm(`Excluir o hábito "${habit.name}"? O histórico dele também será apagado.`)) {
    return Promise.resolve()
  }
  if (selectedHabitId.value === habit.id) selectedHabitId.value = null
  return run(() => habitsStore.remove(habit.id))
}

function duplicateHabit(habit: Habit): Promise<void> {
  const copy = { ...habit, name: `${habit.name.slice(0, 52)} (cópia)` }
  return run(() => habitsStore.create(copy))
}

function handleMenuSelect(key: string): void {
  menu.open = false
  if (menu.kind === 'group') {
    const group = groupsStore.items.find((g) => g.id === menu.id)
    if (!group) return
    if (key === 'edit') openGroupForm(group)
    if (key === 'delete') void removeGroup(group)
    return
  }
  const habit = habitsStore.items.find((h) => h.id === menu.id)
  if (!habit) return
  if (key === 'edit') openHabitForm(habit)
  if (key === 'duplicate') void duplicateHabit(habit)
  if (key === 'delete') void removeHabit(habit)
}
function handleSelectHabit(id: number, selected: boolean): void {
  selectedHabitId.value = selected ? id : null
}

const view = computed({
  get: (): string => String(route.name ?? 'today'),
  set: (name: string) => router.push({ name })
})

function handleSort(): void {
  // Reordenação por arrastar e soltar entra na Fase 3; a ação já tem handler no shell.
}

onMounted(async () => {
  // rede de seguranca: qualquer chamada sem tratamento vira toast
  window.addEventListener('unhandledrejection', (e) => error(errorMessage(e.reason)))

  try {
    await Promise.all([groupsStore.load(), habitsStore.load()])
  } catch (e) {
    error(errorMessage(e))
  } finally {
    loaded.value = true
  }
})
</script>

<template>
  <div class="shell">
    <aside class="sidebar">
      <AppHeader
        title="habits"
        :habit-count="habitsStore.items.length"
        :group-count="groupsStore.items.length"
        @open-settings="router.push({ name: 'settings' })"
      />
      <div class="switcher">
        <ViewSwitcher v-model="view" :options="views" />
      </div>
      <div class="tree-scroll">
        <EmptyState
          v-if="isEmpty"
          icon="folder-plus"
          title="Nenhum hábito ainda"
          description="Cria um grupo para organizar seus hábitos"
          action-label="Criar hábito"
          @action="openGroupForm()"
        />
        <SidebarTree
          v-else
          ref="tree"
          :groups="treeGroups"
          :ungrouped="ungrouped"
          :selected-habit-id="selectedHabitId"
          @select-habit="handleSelectHabit"
          @context-menu="handleContextMenu"
        />
      </div>
      <ActionBar
        :selected-habit="selectedHabit"
        @new-habit="openHabitForm()"
        @new-group="openGroupForm()"
        @edit-habit="openHabitForm"
        @sort="handleSort"
        @collapse-all="tree?.collapseAll()"
      />
    </aside>

    <main class="content">
      <RouterView />
    </main>

    <Toast
      v-if="toast"
      :key="toast.id"
      :message="toast.message"
      :kind="toast.kind"
      @dismiss="dismiss"
    />

    <ContextMenu
      :open="menu.open"
      :x="menu.x"
      :y="menu.y"
      :items="menuItems"
      @select="handleMenuSelect"
      @close="menu.open = false"
    />

    <HabitFormModal
      :open="habitForm.open"
      :habit="habitForm.habit"
      @close="habitForm.open = false"
    />

    <GroupFormModal
      :open="groupForm.open"
      :group="groupForm.group"
      @close="groupForm.open = false"
    />
  </div>
</template>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  height: 100%;
}

.sidebar {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background: var(--bg);
  border-right: 1px solid var(--surface-border);
}

.switcher {
  padding: var(--space-2) var(--space-3) var(--space-3);
}

.tree-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 var(--space-3);
}

.content {
  position: relative;
  min-width: 0;
  overflow-y: auto;
  padding: var(--space-6);
  background: var(--surface);
}
</style>
