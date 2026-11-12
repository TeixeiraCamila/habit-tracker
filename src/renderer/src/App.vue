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
import { Group, Habit } from '@shared/types'
import GroupFormModal from './components/GroupFormModal.vue'
import HabitFormModal from './components/HabitFormModal.vue'

const route = useRoute()
const router = useRouter()
const groupsStore = useGroupsStore()
const habitsStore = useHabitsStore()
const { treeGroups, ungrouped } = useTree()
const { toast, error, dismiss } = useToast()

const selectedHabitId = ref<number | null>(null)
const tree = ref<InstanceType<typeof SidebarTree> | null>(null)

const selectedHabit = computed<Habit | null>(
  () => habitsStore.items.find((habit) => habit.id === selectedHabitId.value) ?? null
)

const views = [
  { value: 'today', label: 'Hoje' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'stats', label: 'Estatisticas' }
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

function handleSelectHabit(id: number, selected: boolean): void {
  selectedHabitId.value = selected ? id : null
}
const view = computed({
  get: (): string => String(route.name ?? 'today'),
  set: (name: string) => router.push({ name })
})

onMounted(async () => {
  // rede de seguranca: qualquer chamada sem tratamento vira toast
  window.addEventListener('unhandledrejection', (e) => error(errorMessage(e.reason)))

  try {
    await Promise.all([groupsStore.load(), habitsStore.load()])
  } catch (e) {
    error(errorMessage(e))
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
        @open-dev="router.push({ name: 'test' })"
      />
      <div class="switcher">
        <ViewSwitcher v-model="view" :options="views" />
      </div>
      <div class="tree-scroll">
        <SidebarTree
          ref="tree"
          :groups="treeGroups"
          :ungrouped="ungrouped"
          :selected-habit-id="selectedHabitId"
          @select-habit="handleSelectHabit"
        />
      </div>
      <ActionBar
        :selected-habit="selectedHabit"
        @new-habit="openHabitForm()"
        @new-group="openGroupForm()"
        @edit-habit="openHabitForm"
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
  min-width: 0;
  overflow-y: auto;
  padding: var(--space-6);
  background: var(--surface);
}
</style>
