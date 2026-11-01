<script setup lang="ts">
import { ref } from 'vue'
import {
  ActionBar,
  AppHeader,
  ColorPicker,
  EmptyState,
  GroupRow,
  HabitRow,
  IconButton,
  IconPicker,
  Modal,
  StarDivider,
  TextField,
  Toast,
  TreeGuide,
  ViewSwitcher
} from '@renderer/components'

const view = ref('Hoje')
const groupExpanded = ref(true)
const habitSelected = ref(true)
const name = ref('Beber água')
const errorName = ref('')
const color = ref('var(--group-orange)')
const icon = ref('★')
const modalOpen = ref(false)
const toast = ref<{
  visible: boolean
  type: 'info' | 'success' | 'error'
  message: string
}>({
  visible: false,
  type: 'info',
  message: ''
})

function showToast(type: 'info' | 'success' | 'error', message: string): void {
  toast.value = { visible: true, type, message }
}
</script>

<template>
  <div class="design-system">
    <AppHeader title="Design system" subtitle="Componentes-base da Fase 1 em um só lugar" />

    <section class="ds-section">
      <h2>AppHeader</h2>
      <p class="ds-note">
        Título, subtítulo e ações. O chevron aparece quando o título é clicável.
      </p>
      <div class="ds-card">
        <AppHeader title="habits" subtitle="12 hábitos, 4 grupos">
          <template #actions>
            <IconButton label="Configurações">⚙</IconButton>
          </template>
        </AppHeader>
        <AppHeader
          title="habits"
          subtitle="12 hábitos, 4 grupos"
          collapsible
          :expanded="groupExpanded"
          @toggle="groupExpanded = !groupExpanded"
        >
          <template #actions>
            <IconButton label="Configurações">⚙</IconButton>
          </template>
        </AppHeader>
      </div>
    </section>

    <section class="ds-section">
      <h2>ViewSwitcher</h2>
      <p class="ds-note">Caixa em cartão com setas para percorrer as visões em ciclo.</p>
      <div class="ds-row">
        <ViewSwitcher v-model="view" />
        <span class="ds-value">Visão atual: {{ view }}</span>
      </div>
    </section>

    <section class="ds-section">
      <h2>GroupRow</h2>
      <p class="ds-note">Linha pastel na cor do grupo, com chevron, ícone, contador e ações.</p>
      <div class="ds-stack">
        <GroupRow
          name="Saúde"
          :expanded="groupExpanded"
          :count="4"
          @toggle="groupExpanded = !groupExpanded"
        >
          <template #icon>☀</template>
          <template #actions>
            <IconButton label="Editar grupo" size="sm">✎</IconButton>
          </template>
        </GroupRow>

        <GroupRow
          name="Estudos"
          color="var(--group-yellow)"
          background="var(--group-yellow-bg)"
          :expanded="false"
          :count="3"
          @toggle="() => {}"
        >
          <template #icon>☾</template>
        </GroupRow>

        <GroupRow
          name="Bem-estar"
          color="var(--group-green)"
          background="var(--group-green-bg)"
          :expanded="true"
          :count="2"
          @toggle="() => {}"
        >
          <template #icon>♡</template>
        </GroupRow>
      </div>
    </section>

    <section class="ds-section">
      <h2>HabitRow</h2>
      <p class="ds-note">Item normal e selecionado; o selecionado vira cartão com sombra.</p>
      <div class="ds-stack">
        <HabitRow
          name="Beber água"
          :selected="habitSelected"
          @select="habitSelected = !habitSelected"
        >
          <template #icon>★</template>
          <template #trailing>
            <IconButton label="Marcar hábito" size="sm">✓</IconButton>
          </template>
        </HabitRow>

        <HabitRow name="Ler 20 páginas">
          <template #icon>☕</template>
        </HabitRow>
      </div>
    </section>

    <section class="ds-section">
      <h2>TreeGuide</h2>
      <p class="ds-note">Linha-guia vertical para indicar a hierarquia da árvore.</p>
      <div class="ds-stack">
        <TreeGuide :level="1" color="var(--group-green)">
          <HabitRow name="Meditar" />
        </TreeGuide>
        <TreeGuide :level="2" color="var(--group-green)">
          <HabitRow name="Alongar" />
        </TreeGuide>
      </div>
    </section>

    <section class="ds-section">
      <h2>IconButton</h2>
      <p class="ds-note">Normal, ativo, desabilitado e tamanho pequeno.</p>
      <div class="ds-row">
        <IconButton label="Novo">+</IconButton>
        <IconButton label="Favorito" active>★</IconButton>
        <IconButton label="Desabilitado" disabled>✕</IconButton>
        <IconButton label="Ordenar" size="sm">↕</IconButton>
        <IconButton label="Recolher" size="sm" active>↥</IconButton>
      </div>
    </section>

    <section class="ds-section">
      <h2>ActionBar</h2>
      <p class="ds-note">Barra inferior com as ações principais da tela.</p>
      <div class="ds-card ds-card--flush">
        <ActionBar>
          <IconButton label="Novo hábito" active>+</IconButton>
          <IconButton label="Novo grupo">▣</IconButton>
          <IconButton label="Ordenar">↕</IconButton>
          <template #end>
            <IconButton label="Recolher tudo">↥</IconButton>
          </template>
        </ActionBar>
      </div>
    </section>

    <section class="ds-section">
      <h2>StarDivider</h2>
      <p class="ds-note">Divisor decorativo para o fim das listas.</p>
      <div class="ds-card">
        <StarDivider />
      </div>
    </section>

    <section class="ds-section">
      <h2>TextField</h2>
      <p class="ds-note">Normal, preenchido, com erro e desabilitado.</p>
      <div class="ds-stack">
        <TextField v-model="name" label="Nome" placeholder="Nome do hábito" />
        <TextField
          v-model="errorName"
          label="Obrigatório"
          placeholder="Digite um nome"
          error="Informe um nome"
        />
        <TextField v-model="name" label="Desabilitado" disabled />
      </div>
    </section>

    <section class="ds-section">
      <h2>ColorPicker</h2>
      <p class="ds-note">Paleta pastel com o tom do grupo e o fundo correspondente.</p>
      <div class="ds-stack">
        <ColorPicker v-model="color" />
        <span class="ds-value">Selecionado: {{ color }}</span>
      </div>
    </section>

    <section class="ds-section">
      <h2>IconPicker</h2>
      <p class="ds-note">
        Grade de ícones; aceita um slot para renderizar ícones lucide no futuro.
      </p>
      <div class="ds-stack">
        <IconPicker v-model="icon" />
        <span class="ds-value">Selecionado: {{ icon }}</span>
      </div>
    </section>

    <section class="ds-section">
      <h2>Modal</h2>
      <p class="ds-note">Abre sobre a tela, fecha no Esc, no botão ou no fundo.</p>
      <div class="ds-row">
        <button class="ds-button" type="button" @click="modalOpen = true">Abrir modal</button>
      </div>
    </section>

    <section class="ds-section">
      <h2>Toast</h2>
      <p class="ds-note">Aviso temporário com variantes de informação, sucesso e erro.</p>
      <div class="ds-row">
        <button class="ds-button" type="button" @click="showToast('info', 'Informação')">
          Info
        </button>
        <button class="ds-button" type="button" @click="showToast('success', 'Tudo certo')">
          Sucesso
        </button>
        <button class="ds-button" type="button" @click="showToast('error', 'Algo deu errado')">
          Erro
        </button>
      </div>
    </section>

    <section class="ds-section">
      <h2>EmptyState</h2>
      <p class="ds-note">Estado vazio com ícone, descrição e ação opcional.</p>
      <div class="ds-card">
        <EmptyState
          title="Nenhum hábito ainda"
          description="Crie seu primeiro hábito para começar a acompanhar o dia."
        >
          <template #icon>
            <span class="ds-empty-icon">☆</span>
          </template>
          <template #actions>
            <button class="ds-button" type="button" @click="modalOpen = true">Criar hábito</button>
          </template>
        </EmptyState>
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

    <Toast
      :visible="toast.visible"
      :message="toast.message"
      :type="toast.type"
      @close="toast.visible = false"
    />
  </div>
</template>

<style scoped>
.design-system {
  height: 100%;
  padding: 0 var(--space-6) var(--space-6);
  overflow-y: auto;
}

.ds-section {
  padding: var(--space-6) 0;
  border-bottom: 1px dashed var(--surface-border);
}

.ds-section:last-child {
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

.ds-empty-icon {
  display: block;
  font-size: var(--text-xl);
  color: var(--text-muted);
}
</style>
