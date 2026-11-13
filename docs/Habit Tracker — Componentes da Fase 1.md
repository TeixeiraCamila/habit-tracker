# Habit Tracker — Componentes da Fase 1

Cada componente com a sua responsabilidade, as props principais e os eventos. Todos usam só os tokens do `tokens.css`, sem cores fixas. Descrição conferida com o código do repositório (branch main).

## Estrutura da sidebar

### AppHeader

Topo da sidebar: título em negrito (`habits`), subtítulo com a contagem ("12 hábitos, 4 grupos", com singular e plural) e a engrenagem de configurações. Em desenvolvimento aparece também o botão DEV, que abre o catálogo de componentes.

- Props: `title`, `habitCount`, `groupCount`
- Emits: `open-settings`, `open-dev` (botão DEV, só em desenvolvimento)

### ViewSwitcher

Caixa em cartão com o nome da visão atual e duas setas que percorrem as opções em ciclo (do fim volta ao começo). Troca entre Hoje, Semana, Mês e Estatísticas.

- Props/v-model: `modelValue` (a visão ativa), `options`
- Emits: `update:modelValue`

### SidebarTree

Container da árvore da sidebar. Mostra cada grupo (`GroupRow`) com seus hábitos (`HabitRow`) dentro de um `TreeGuide`, e termina com a seção "Sem grupo" e o `StarDivider`. Cada grupo expande e recolhe com animação, e os hábitos de grupos recolhidos ficam `inert`, fora da navegação por Tab.

- Props: `groups` (cada grupo já com seus hábitos), `ungrouped` (opcional), `selectedHabitId` (opcional)
- Emits: `select-habit` (`id` e `selected`; clicar de novo no hábito selecionado o desmarca) e `context-menu` (`{ kind: 'group' | 'habit', id, event }`)
- Estado interno: conjunto de grupos recolhidos; um grupo novo nasce aberto
- Métodos expostos: `collapseAll()` e `expandAll()`, usados pela `ActionBar`
- Não busca dados: a árvore é montada pelo composable `useTree` a partir dos stores

### GroupRow

Linha de grupo: fundo pastel, chevron de expandir, ícone de traço e nome na cor do grupo.

- Props: `name`, `color`, `icon`, `expanded`
- Emits: `toggle`, `context-menu`

### HabitRow

Linha de hábito: ícone e nome. Quando selecionada, vira cartão com borda e sombra suave, e o nome fica em negrito.

- Props: `name`, `icon`, `selected`
- Emits: `select` (o novo valor de `selected`; clicar de novo desmarca) e `context-menu`
- Slot: `trailing` (streak ou checkbox, entram nas Fases 4 e 6)

### TreeGuide

Linha vertical de 1 px na cor do grupo, que acompanha os filhos expandidos. Só visual.

- Props: `color`

### StarDivider

O divisor decorativo `*.☆.☽.☆.☽.☆.*` no fim da lista. Só visual, sem props.

### ActionBar

Barra inferior com os ícones definidos em `actions.ts`: novo hábito, novo grupo, ordenar, alternar visão (hoje sem handler) e recolher tudo. Com um hábito selecionado, "Novo hábito" vira "Editar hábito" (ícone `pencil`). Na Fase 3, a ação `toggle-view` passa a ser o toggle da sidebar.

- Props: `activeAction` (opcional), `selectedHabit` (opcional)
- Emits: `new-habit`, `new-group`, `sort`, `toggle-view`, `collapse-all` e `edit-habit` (com o hábito selecionado)
- Usa `IconButton` para cada ação

### Toggle da sidebar (planejado na Fase 3)

Mostra e oculta a sidebar inteira para dar mais espaço à área de conteúdo.

- Estado `sidebarOpen` num store `ui`, guardado em `localStorage` dentro de `try/catch`.
- A ação `toggle-view` da `ActionBar` vira "Mostrar/ocultar sidebar", com o ícone `panel-left` (a adicionar em `icons.ts`).
- Com a sidebar recolhida, um `IconButton` fixo na área de conteúdo a reabre.
- Atalho `Ctrl/Cmd+B`, registrado em `useHotkeys`.
- No `.shell` do `App.vue`, a coluna da grid anima entre `var(--sidebar-width)` e `0`; a sidebar recolhida recebe `inert` e `aria-hidden`.
- A animação respeita `prefers-reduced-motion`.

## Componentes de uso geral

### IconButton

Botão só com ícone, com estados normal, hover, ativo (pílula), foco e desabilitado. Aceita `aria-label` obrigatório, porque não tem texto.

- Props: `icon`, `label`, `active`, `disabled`
- Emits: `click`

### Modal

Janela sobre o conteúdo, com título, corpo e rodapé de ações. Fecha com `Esc` e clique fora, e mantém o foco preso dentro enquanto está aberta.

- Props: `open`, `title`
- Emits: `close`
- Slots: `default`, `footer`

### Toast

Aviso temporário no canto da janela (sucesso ou erro), que some sozinho depois de alguns segundos. Serve para os erros de IPC da Fase 2.

- Props: `message`, `kind` (`success` | `error`), `duration`
- Emits: `dismiss`

### TextField

Campo de texto com rótulo, mensagem de erro e foco visível. É a base dos formulários de grupo e hábito.

- Props/v-model: `modelValue`, `label`, `error`, `placeholder`
- Emits: `update:modelValue`

### ColorPicker

Seletor de cor do grupo: círculos com as cores da paleta (laranja, amarelo, verde, vermelho e as extras). A cor escolhida fica marcada.

- Props/v-model: `modelValue` (a chave da cor)
- Emits: `update:modelValue`

### IconPicker

Grade de ícones lucide para escolher o ícone do grupo ou hábito, com o selecionado destacado.

- Props/v-model: `modelValue` (o nome do ícone), `icons`
- Emits: `update:modelValue`

### EmptyState

Mensagem acolhedora quando não há dados (nenhum grupo, nenhum hábito no dia), com ícone, texto curto e um botão de ação opcional.

- Props: `icon`, `title`, `description`, `actionLabel`
- Emits: `action`

## Formulários e utilitários

### GroupFormModal

Modal de novo/editar grupo: nome, cor e ícone, com a linha do grupo (`GroupRow`) como pré-visualização. Valida com `newGroupSchema`, foca o primeiro campo com erro e mostra o erro de salvamento dentro do modal.

- Props: `open`, `group` (`null` para criar)
- Emits: `close`

### HabitFormModal

Modal de novo/editar hábito: nome, descrição, grupo, ícone, tipo (feito/contador), meta e unidade, frequência (todo dia, dias da semana, X vezes por semana), data de início e lembrete. Valida com `newHabitSchema` e foca o primeiro campo com erro.

- Props: `open`, `habit` (`null` para criar)
- Emits: `close`

### AppIcon

Ícone lucide pelo nome estável em kebab-case (ex.: `folder-plus`), com `aria-hidden`.

- Props: `name`, `size` (padrão 18)

### Arquivos de apoio

- `actions.ts`: `ACTION_ITEMS` e os tipos `ActionKey` e `ActionItem`.
- `groupColors.ts`: `GROUP_COLORS` (7 cores) e `groupColorStyle`.
- `index.ts`: reexporta os componentes-base, usado pelo catálogo `/test`.

## Ordem de construção (Fase 1 concluída)

1. `StarDivider`, `TreeGuide`, `IconButton` (sem dependências)
2. `GroupRow`, `HabitRow`, `ActionBar`, `ViewSwitcher`, `AppHeader`
3. `SidebarTree` (junta as linhas)
4. `Modal`, `Toast`, `TextField`, `ColorPicker`, `IconPicker`, `EmptyState`

Todos os componentes acima existem em `src/renderer/src/components/` e estão reunidos no catálogo da rota `/test`, disponível só em desenvolvimento.
