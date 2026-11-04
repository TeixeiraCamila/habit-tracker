# Habit Tracker — Componentes da Fase 1

Cada componente com a sua responsabilidade, as props principais e os eventos. Todos usam só os tokens do `tokens.css`, sem cores fixas.

## Estrutura da sidebar

### AppHeader

Topo da sidebar: título em negrito c (ex.: `habits`), subtítulo com a contagem ("12 hábitos, 4 grupos") e a engrenagem de configurações.

- Props: `title`, `habitCount`, `groupCount`
- Emits: `open-settings`

### ViewSwitcher

Caixa em cartão com setas ⌃⌄, como o campo "Files" do print. Troca entre Hoje, Semana, Mês e Estatísticas.

- Props/v-model: `modelValue` (a visão ativa), `options`
- Emits: `update:modelValue`

### SidebarTree

Container da árvore. Recebe grupos com seus hábitos, controla quais grupos estão expandidos e qual hábito está selecionado, e monta `GroupRow`, `HabitRow` e `TreeGuide`. Também mostra a seção de hábitos sem grupo e o `StarDivider` no final.

- Props: `groups`, `habits`, `selectedHabitId`
- Emits: `select-habit`, `toggle-group`, `reorder`, `context-menu`
- Estado interno: grupos expandidos (a lógica de dados fica nos stores)

### GroupRow

Linha de grupo: fundo pastel, chevron de expandir, ícone de traço e nome na cor do grupo.

- Props: `name`, `color`, `icon`, `expanded`
- Emits: `toggle`, `context-menu`

### HabitRow

Linha de hábito: ícone e nome. Quando selecionada, vira cartão com borda e sombra suave, e o nome fica em negrito.

- Props: `name`, `icon`, `selected`
- Emits: `select`, `context-menu`
- Slot: `trailing` (streak ou checkbox, entram nas Fases 4 e 6)

### TreeGuide

Linha vertical de 1 px na cor do grupo, que acompanha os filhos expandidos. Só visual.

- Props: `color`

### StarDivider

O divisor decorativo `*.☆.☽.☆.☽.☆.*` no fim da lista. Só visual, sem props.

### ActionBar

Barra inferior com os ícones de ação: novo hábito, novo grupo, ordenar, alternar visão, recolher tudo. O item ativo ganha a pílula de fundo.

- Props: `activeAction`
- Emits: `new-habit`, `new-group`, `sort`, `toggle-view`, `collapse-all`
- Usa `IconButton` para cada ação

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

## Ordem sugerida de construção

1. `StarDivider`, `TreeGuide`, `IconButton` (sem dependências)
2. `GroupRow`, `HabitRow`, `ActionBar`, `ViewSwitcher`, `AppHeader`
3. `SidebarTree` (junta as linhas)
4. `Modal`, `Toast`, `TextField`, `ColorPicker`, `IconPicker`, `EmptyState`

Assim a sidebar fica visível já no começo, para conferir contra o print, e os formulários vêm depois, quando a Fase 3 precisar deles.
