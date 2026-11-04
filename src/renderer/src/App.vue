// App principal do renderer: monta a sidebar com header, seletor de visão e árvore de hábitos.
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@renderer/components/AppHeader.vue'
import ViewSwitcher from '@renderer/components/ViewSwitcher.vue'
import SidebarTree from '@renderer/components/SidebarTree.vue'
import ActionBar from '@renderer/components/ActionBar.vue'
import { mockTree } from '@renderer/mocks/tree'

const route = useRoute()
const router = useRouter()

const groups = mockTree
const habitCount = groups.reduce((n, g) => n + g.habits.length, 0)
const selectedHabitId = ref<number | null>(null)
const tree = ref<InstanceType<typeof SidebarTree> | null>(null)

const views = ['Hoje', 'Semana', 'Mês', 'Estatísticas']

const viewRoutes: Record<string, string> = {
  Hoje: 'today',
  Semana: 'week',
  Mês: 'month',
  Estatísticas: 'stats'
}

const view = computed({
  get: (): string =>
    views.find((option) => viewRoutes[option] === String(route.name ?? 'today')) ?? views[0],
  set: (name: string) => router.push({ name: viewRoutes[name] ?? 'today' })
})
</script>

<template>
  <div class="shell">
    <aside class="sidebar">
      <AppHeader
        title="habits"
        :habit-count="habitCount"
        :group-count="groups.length"
        @open-settings="router.push({ name: 'settings' })"
        @open-dev="router.push({ name: 'test' })"
      />
      <div class="switcher">
        <ViewSwitcher v-model="view" :options="views" />
      </div>
      <div class="tree-scroll">
        <SidebarTree
          ref="tree"
          :groups="groups"
          :selected-habit-id="selectedHabitId"
          @select-habit="selectedHabitId = $event"
        />
      </div>
      <ActionBar @collapse-all="tree?.collapseAll()" />
    </aside>

    <main class="content">
      <RouterView />
    </main>
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
