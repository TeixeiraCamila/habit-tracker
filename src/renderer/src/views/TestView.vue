<script setup lang="ts">
import type { Group, GroupColor, Habit } from '@shared/types'
import {
  ActionBar,
  AppHeader,
  type ActionKey,
  ColorPicker,
  EmptyState,
  GroupRow,
  HabitRow,
  IconButton,
  IconPicker,
  Modal,
  SidebarTree,
  StarDivider,
  TextField,
  Toast,
  TreeGuide,
  ViewSwitcher
} from '@renderer/components'
import { ref } from 'vue'

const groups: Group[] = [
  { id: 1, name: 'Saúde', color: 'orange', icon: 'sun', position: 0 },
  { id: 2, name: 'Estudos', color: 'yellow', icon: 'book-open', position: 1 },
  { id: 3, name: 'Bem-estar', color: 'green', icon: 'heart', position: 2 }
]

function makeHabit(id: number, groupId: number | null, name: string, icon: string): Habit {
  return {
    id,
    groupId,
    name,
    icon,
    kind: 'boolean',
    target: 1,
    freqType: 'daily',
    startDate: '2026-01-01',
    position: id
  }
}

const habits = ref<Habit[]>([
  makeHabit(1, 1, 'Beber água', 'droplets'),
  makeHabit(2, 1, 'Alongar', 'dumbbell'),
  makeHabit(3, 2, 'Ler 20 páginas', 'book-open'),
  makeHabit(4, null, 'Meditar', 'leaf')
])

const view = ref('Hoje')
const selectedHabitId = ref<number | null>(1)
const groupExpanded = ref(true)
const habitSelected = ref(true)
const name = ref('Beber água')
const errorName = ref('')
const color = ref<GroupColor>('orange')
const icon = ref('star')
const activeAction = ref<ActionKey | null>('new-habit')
const modalOpen = ref(false)
const toast = ref<{ message: string; kind: 'success' | 'error' }>({
  message: '',
  kind: 'success'
})

function showToast(message: string, kind: 'success' | 'error' = 'success'): void {
  toast.value = { message, kind }
}

function selectAction(action: ActionKey, message: string): void {
  activeAction.value = action
  showToast(message)
}

function handleReorder(payload: { habitId: number; targetId: number }): void {
  const from = habits.value.findIndex((habit) => habit.id === payload.habitId)
  const to = habits.value.findIndex((habit) => habit.id === payload.targetId)
  if (from < 0 || to < 0) return

  const [moved] = habits.value.splice(from, 1)
  if (moved) habits.value.splice(to, 0, moved)
  showToast('Hábitos reordenados')
}

function handleContextMenu(payload: { kind: 'group' | 'habit'; id: number }): void {
  const label = payload.kind === 'group' ? 'Grupo' : 'Hábito'
  showToast(`${label} #${payload.id} selecionado para o menu`)
}
</script>

<template>
  <div class="design-system">
    <header class="ds-intro">
      <h1>Design system</h1>
      <p>Componentes da Fase 1 seguindo o documento de componentes.</p>
    </header>

    <section class="ds-section">
      <h2>AppHeader</h2>
      <p class="ds-note">Título com chevron, contagem e engrenagem de configurações.</p>
      <div class="ds-card ds-card--flush">
        <AppHeader
          title="habits"
          :habit-count="habits.length"
          :group-count="groups.length"
          @open-settings="showToast('Configurações abertas')"
        />
      </div>
    </section>

    <section class="ds-section">
      <h2>ViewSwitcher</h2>
      <p class="ds-note">Caixa em cartão com setas que percorrem as visões em ciclo.</p>
      <div class="ds-row">
        <ViewSwitcher v-model="view" />
        <span class="ds-value">Visão atual: {{ view }}</span>
      </div>
    </section>

    <section class="ds-section">
      <h2>SidebarTree</h2>
      <p class="ds-note">
        Grupos, hábitos, seção sem grupo e divisor final. Arraste um hábito sobre outro para
        reordenar.
      </p>
      <div class="ds-sidebar">
        <SidebarTree
          :groups="groups"
          :habits="habits"
          :selected-habit-id="selectedHabitId"
          @select-habit="selectedHabitId = $event"
          @toggle-group="showToast('Grupo alternado')"
          @reorder="handleReorder"
          @context-menu="handleContextMenu"
        />
      </div>
    </section>

    <section class="ds-section">
      <h2>GroupRow</h2>
      <p class="ds-note">Linha pastel na cor do grupo, com chevron de expandir.</p>
      <div class="ds-stack">
        <GroupRow
          name="Saúde"
          color="orange"
          icon="sun"
          :expanded="groupExpanded"
          @toggle="groupExpanded = !groupExpanded"
          @context-menu="handleContextMenu({ kind: 'group', id: 1 })"
        />
        <GroupRow
          name="Estudos"
          color="yellow"
          icon="book-open"
          :expanded="false"
          @toggle="() => {}"
          @context-menu="handleContextMenu({ kind: 'group', id: 2 })"
        />
        <GroupRow
          name="Bem-estar"
          color="green"
          icon="heart"
          :expanded="true"
          @toggle="() => {}"
          @context-menu="handleContextMenu({ kind: 'group', id: 3 })"
        />
      </div>
    </section>

    <section class="ds-section">
      <h2>HabitRow</h2>
      <p class="ds-note">Item normal e item selecionado, que vira cartão com sombra.</p>
      <div class="ds-stack">
        <HabitRow
          name="Beber água"
          icon="droplets"
          :selected="habitSelected"
          @select="habitSelected = !habitSelected"
          @context-menu="handleContextMenu({ kind: 'habit', id: 1 })"
        >
          <template #trailing>
            <IconButton icon="check" label="Marcar hábito" active />
          </template>
        </HabitRow>
        <HabitRow
          name="Ler 20 páginas"
          icon="book-open"
          :selected="false"
          @select="() => {}"
          @context-menu="handleContextMenu({ kind: 'habit', id: 3 })"
        />
      </div>
    </section>

    <section class="ds-section">
      <h2>TreeGuide</h2>
      <p class="ds-note">Linha-guia vertical de 1 px na cor do grupo.</p>
      <div class="ds-stack">
        <TreeGuide color="var(--group-green)">
          <HabitRow name="Meditar" icon="leaf" :selected="false" @select="() => {}" />
          <HabitRow name="Alongar" icon="dumbbell" :selected="false" @select="() => {}" />
        </TreeGuide>
      </div>
    </section>

    <section class="ds-section">
      <h2>StarDivider</h2>
      <p class="ds-note">Divisor decorativo do fim da lista.</p>
      <div class="ds-card">
        <StarDivider />
      </div>
    </section>

    <section class="ds-section">
      <h2>ActionBar</h2>
      <p class="ds-note">Barra inferior; o item ativo ganha a pílula de fundo.</p>
      <div class="ds-card ds-card--flush">
        <ActionBar
          :active-action="activeAction"
          @new-habit="selectAction('new-habit', 'Novo hábito')"
          @new-group="selectAction('new-group', 'Novo grupo')"
          @sort="selectAction('sort', 'Ordenar')"
          @toggle-view="selectAction('toggle-view', 'Alternar visão')"
          @collapse-all="selectAction('collapse-all', 'Recolher tudo')"
        />
      </div>
    </section>

    <section class="ds-section">
      <h2>IconButton</h2>
      <p class="ds-note">Normal, ativo (pílula), desabilitado e foco pelo teclado.</p>
      <div class="ds-row">
        <IconButton icon="plus" label="Novo" @click="showToast('Novo')" />
        <IconButton icon="star" label="Favorito" active @click="showToast('Favorito')" />
        <IconButton icon="x" label="Desabilitado" disabled />
        <IconButton icon="settings" label="Configurações" @click="showToast('Configurações')" />
      </div>
    </section>

    <section class="ds-section">
      <h2>Modal</h2>
      <p class="ds-note">Título, corpo e rodapé; fecha com Esc, botão ou clique fora.</p>
      <div class="ds-row">
        <button class="ds-button" type="button" @click="modalOpen = true">Abrir modal</button>
      </div>
    </section>

    <section class="ds-section">
      <h2>Toast</h2>
      <p class="ds-note">Aviso no canto da janela, que some sozinho depois de alguns segundos.</p>
      <div class="ds-row">
        <button class="ds-button" type="button" @click="showToast('Tudo certo')">Sucesso</button>
        <button class="ds-button" type="button" @click="showToast('Algo deu errado', 'error')">
          Erro
        </button>
      </div>
    </section>

    <section class="ds-section">
      <h2>TextField</h2>
      <p class="ds-note">Normal, preenchido e com mensagem de erro.</p>
      <div class="ds-stack">
        <TextField v-model="name" label="Nome" placeholder="Nome do hábito" />
        <TextField
          v-model="errorName"
          label="Obrigatório"
          placeholder="Digite um nome"
          error="Informe um nome"
        />
      </div>
    </section>

    <section class="ds-section">
      <h2>ColorPicker</h2>
      <p class="ds-note">Paleta de grupos com a cor escolhida marcada.</p>
      <div class="ds-stack">
        <ColorPicker v-model="color" />
        <span class="ds-value">Selecionado: {{ color }}</span>
      </div>
    </section>

    <section class="ds-section">
      <h2>IconPicker</h2>
      <p class="ds-note">Grade de ícones lucide com o selecionado destacado.</p>
      <div class="ds-stack">
        <IconPicker v-model="icon" />
        <span class="ds-value">Selecionado: {{ icon }}</span>
      </div>
    </section>

    <section class="ds-section">
      <h2>EmptyState</h2>
      <p class="ds-note">Estado vazio com ícone, texto curto e ação opcional.</p>
      <div class="ds-card">
        <EmptyState
          icon="star"
          title="Nenhum hábito ainda"
          description="Crie seu primeiro hábito para começar a acompanhar o dia."
          action-label="Criar hábito"
          @action="modalOpen = true"
        />
      </div>
    </section>

    <StarDivider />

    <Modal :open="modalOpen" title="Novo hábito" @close="modalOpen = false">
      <div class="ds-stack">
        <TextField v-model="name" label="Nome" placeholder="Ex.: Beber água" />
        <ColorPicker v-model="color" />
        <IconPicker v-model="icon" />
      </div>

      <template #footer>
        <button class="ds-button ds-button--ghost" type="button" @click="modalOpen = false">
          Cancelar
        </button>
        <button class="ds-button" type="button" @click="modalOpen = false">Salvar</button>
      </template>
    </Modal>

    <Toast :message="toast.message" :kind="toast.kind" @dismiss="toast.message = ''" />
  </div>
</template>

<style scoped>
.design-system {
  height: 100%;
  padding: 0 var(--space-6) var(--space-6);
  overflow-y: auto;
}

.ds-intro {
  padding: var(--space-6) 0 var(--space-4);
  border-bottom: 1px dashed var(--surface-border);
}

.ds-intro h1 {
  font-size: var(--text-xl);
}

.ds-intro p {
  margin-top: var(--space-1);
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.ds-section {
  padding: var(--space-6) 0;
  border-bottom: 1px dashed var(--surface-border);
}

.ds-section:last-of-type {
  border-bottom: 0;
}

.ds-section h2 {
  margin-bottom: var(--space-1);
  font-size: var(--text-lg);
}

.ds-note {
  margin-bottom: var(--space-4);
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.ds-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
}

.ds-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 360px;
}

.ds-value {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.ds-card {
  padding: var(--space-3);
  background: var(--bg);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.ds-card--flush {
  padding: 0;
  overflow: hidden;
}

.ds-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: var(--sidebar-width);
  max-width: 100%;
  padding: var(--space-3);
  background: var(--bg);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
}

.ds-button {
  min-height: 36px;
  padding: 0 var(--space-4);
  font-size: var(--text-sm);
  color: var(--text-title);
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  transition: border-color var(--motion-fast) var(--ease-out);
}

.ds-button:hover {
  border-color: var(--text-muted);
}

.ds-button--ghost {
  background: transparent;
}
</style>
