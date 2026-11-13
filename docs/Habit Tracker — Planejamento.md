# Habit Tracker — Planejamento

App desktop pessoal para acompanhar hábitos diários · Vue 3 + TypeScript + Vite + Electron

## Estado atual do repositório

Análise de `github.com/TeixeiraCamila/habit-tracker` (branch `main`). O plano abaixo reflete o que já está implementado.

| Fase   | Status        | O que existe no código                                                                                                                                                                            |
| ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0      | Concluída     | electron-vite, Vue 3 + TypeScript, Pinia, Vue Router (hash), ESLint, Prettier, `vue-tsc`, Vitest e CI; segurança do Electron (sandbox, CSP, navegação bloqueada); aliases `@shared` e `@renderer` |
| 1      | Concluída     | `tokens.css` com 7 cores de grupo e contraste AA, Courier Prime, `base.css`, 18 componentes, sidebar e layout, catálogo em `/test` (só em dev)                                                    |
| 2      | Concluída     | `better-sqlite3`, migração `001_init.sql`, repositórios, schemas Zod, IPC com `IpcResult`, preload tipado, seed (`npm run dev:seed`) e testes                                                     |
| 3      | Em andamento  | stores, sidebar com dados reais, modais de grupo e hábito com validação, edição de hábito pela barra de ações                                                                                     |
| 4 a 10 | Não iniciadas | só existem arquivos placeholders (views, stores `today` e `settings`, serviços e handlers de estatísticas e dados)                                                                                |

**Pendências conhecidas no código**

- Nenhuma pendência está aberta no momento; todas foram resolvidas:

  1. O `remove` do store de hábitos passa a chamar `api.habits.remove` e limpar a lista local.
  2. O `App.vue` trata o `context-menu` da `SidebarTree`, abrindo o formulário de edição (grupo ou hábito).
  3. As ações `sort` e `toggle-view` da `ActionBar` ganharam handler no shell; `toggle-view` vira o toggle da sidebar.
  4. O seed passou a usar ícones no formato kebab-case (`sunrise`), alinhado ao mapa de `icons.ts`.
  5. Código legado de arquivar hábitos removido (coluna `archived_at`, IPC, preload, `Api`, store, tipo e teste).
  6. `schemas.ts` sem `.optional()` duplicado e mensagem de nome corrigida para "Use no máximo 60 caracteres".
  7. Removido o `console.log` de depuração de `habits.load`.
  8. `package.json`, `electron-builder.yml` e `setAppUserModelId` com valores da aplicação (`com.habittracker.app`, descrição e autor do projeto).

- `README.md` e `AGENTS.md` atualizados para refletir os estados de fase e a regra de exclusão.

## 1. Visão geral

Um aplicativo desktop, local-first e offline, para registrar hábitos diários, acompanhar sequências (streaks) e visualizar progresso. Sem conta, sem servidor, sem nuvem: os dados ficam em um arquivo SQLite na máquina da usuária.

**Princípios**

- Simples primeiro: cada recurso entra só se resolver um problema real do uso diário.
- Local-first: tudo funciona sem internet; backup é um arquivo.
- Check-in em segundos: marcar um hábito deve levar um clique.
- Visual calmo: bege, monoespaçada, pastéis; sem excesso de gráficos.

## 2. Escopo

### 2.1 Dentro do escopo (MVP)

- Grupos de hábitos (equivalente às pastas do print) com cor e ícone.
- Hábitos com nome, ícone, frequência (todo dia, dias da semana, X vezes por semana) e meta por dia (feito/não feito ou contador).
- Tela "Hoje" com check-in rápido.
- Visão semanal e mensal (calendário de hábitos).
- Streak atual, maior streak e taxa de conclusão.
- Heatmap anual por hábito.
- Sidebar com toggle para mostrar/ocultar, com atalho `Ctrl/Cmd+B`.
- Notas opcionais por check-in.
- Exportar/importar dados (JSON) e backup do banco.
- Notificações de lembrete e ícone na bandeja.
- Instalador para Windows, macOS e Linux.

### 2.2 Fora do escopo (por enquanto)

- Sincronização na nuvem, múltiplos dispositivos e contas.
- Gamificação (XP, níveis, conquistas).
- Compartilhamento social.
- App mobile.
- IA/recomendações.

### 2.3 Ideias para depois do MVP

- Sincronização via arquivo em pasta (Dropbox/Drive) ou export automático.
- Atalho global de check-in rápido.
- Tags e filtros avançados.
- Hábitos com horário e lembretes múltiplos.

### 2.4 Requisitos não funcionais

- Abrir em menos de 2 s; interação instantânea (consultas locais).
- Zero perda de dados: escrita transacional e backup automático.
- Segurança do Electron: `contextIsolation` ligado, `nodeIntegration` desligado, sem acesso direto do renderer ao banco.
- Acessibilidade básica: navegação por teclado e contraste adequado.

## 3. Tecnologias

| Camada        | Escolha                                                                  | Motivo                                                                                              |
| ------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| UI            | Vue 3 (Composition API, `<script setup>`)                                | Stack principal da usuária                                                                          |
| Linguagem     | TypeScript                                                               | Tipos compartilhados entre main, preload e renderer                                                 |
| Build         | Vite + **electron-vite**                                                 | Config pronta para main/preload/renderer com HMR; menos setup manual que juntar plugins             |
| Desktop       | Electron                                                                 | Pedido do projeto; ecossistema maduro                                                               |
| Empacotamento | electron-builder                                                         | Gera `.exe`, `.dmg`, `.AppImage`/`.deb`                                                             |
| Estado        | Pinia                                                                    | Padrão do Vue 3, simples                                                                            |
| Rotas         | Vue Router (hash mode)                                                   | Hash mode funciona bem com `file://`                                                                |
| Banco         | **SQLite via better-sqlite3**                                            | Local, rápido, transacional, síncrono no main; melhor que JSON/localStorage para consultas por data |
| Migrações     | Arquivos `.sql` numerados + runner simples                               | Sem ORM: menos camadas, mais controle                                                               |
| Validação     | Zod                                                                      | Validar payloads de IPC e import de JSON                                                            |
| Datas         | Utilitários próprios (shared/date.ts)                                    | Só toDateKey e addDays por enquanto; date-fns entra se o cálculo de streaks pedir                   |
| Ícones        | lucide-vue-next                                                          | Ícones de traço fino, parecidos com os do print                                                     |
| Fonte         | Courier Prime (`@fontsource/courier-prime`)                              | Monoespaçada serifada, próxima à do print; embutida para funcionar offline                          |
| Gráficos      | SVG próprio (heatmap e barras)                                           | Evita dependência pesada para gráficos simples                                                      |
| Testes        | Vitest (unit, já configurado) + Playwright (e2e, previsto para a Fase 9) | Vitest já é usado pela usuária                                                                      |
| Qualidade     | ESLint + Prettier + `vue-tsc`                                            | Padronização e checagem de tipos                                                                    |
| CI            | GitHub Actions (build matrix win/mac/linux)                              | Gerar instaladores automaticamente                                                                  |

**Versões no repositório:** Node 24 (`.nvmrc`), Electron 44, Vite 8, Vue 3.5, Pinia 4, Vue Router 5, Zod 4, better-sqlite3 13, Vitest 5, ESLint 10 e TypeScript 5.9. O `electron-updater` já está nas dependências, mas sem configuração real.

### 3.1 Alternativas avaliadas

- **Tauri (Rust):** instalador muito menor (\~5–10 MB contra \~100 MB) e menor uso de memória. Melhor tecnicamente para um app tão simples, mas exige Rust no backend. Mantemos Electron porque foi o pedido e usa só TypeScript; fica registrado como migração possível, já que a UI Vue é reaproveitável.
- **IndexedDB / localStorage:** zero dependência nativa, mas consultas por intervalo de datas e backup ficam piores. Descartado.
- **Drizzle/Prisma:** desnecessários para 4 tabelas; SQL direto com funções tipadas é suficiente.
- **better-sqlite3 vs node:sqlite:** better-sqlite3 é mais estável hoje; exige rebuild nativo para a versão do Electron (tratado pelo electron-builder com `@electron/rebuild`).

## 4. Arquitetura

### 4.1 Processos do Electron

```
┌─────────────────────────┐        IPC (invoke/handle)        ┌──────────────────────────┐
│ Renderer (Vue 3 + Pinia)│ ────────────────────────────────▶ │ Main (Node)              │
│ Telas, componentes,     │   window.api.* (contextBridge)    │ SQLite, migrações,       │
│ stores, composables     │ ◀──────────────────────────────── │ notificações, bandeja,   │
└─────────────────────────┘          via preload              │ backup, janelas          │
                                                             └──────────────────────────┘
```

- **Main:** único dono do banco. Registra handlers IPC, valida entrada com Zod e executa transações.
- **Preload:** expõe `window.api` tipado e mínimo via `contextBridge`. Nenhum acesso genérico a `ipcRenderer`.
- **Renderer:** só UI e estado. Fala com o main exclusivamente por `window.api`.

### 4.2 Estrutura de pastas

```
habit-tracker/
├─ src/
│  ├─ main/
│  │  ├─ index.ts            # janela, segurança, ciclo de vida, banco e IPC
│  │  ├─ paths.ts            # caminho do banco (userData)
│  │  ├─ db/
│  │  │  ├─ connection.ts    # abre o SQLite (WAL, foreign keys)
│  │  │  ├─ migrate.ts       # runner de migrações
│  │  │  ├─ seed.ts          # dados de desenvolvimento
│  │  │  └─ migrations/001_init.sql
│  │  ├─ repositories/       # groups, habits, completions, settings
│  │  ├─ ipc/                # handle.ts, errors.ts e um handler por domínio
│  │  └─ services/           # stats, backup, notifications, tray (placeholders)
│  ├─ preload/
│  │  ├─ index.ts            # contextBridge -> window.api
│  │  └─ global.d.ts         # tipo de window.api
│  ├─ shared/
│  │  ├─ types.ts, schemas.ts, api.ts, ipc-channels.ts
│  │  └─ result.ts, defaults.ts, date.ts
│  └─ renderer/
│     ├─ index.html
│     └─ src/
│        ├─ main.ts, App.vue, api.ts, icons.ts
│        ├─ router/          # rotas em hash mode (/test só em dev)
│        ├─ stores/          # groups e habits (today e settings são placeholders)
│        ├─ composables/     # useTree e useToast (useDate, useHotkeys, useStreaks: placeholders)
│        ├─ components/      # 18 componentes + actions.ts, groupColors.ts, index.ts
│        ├─ views/           # Today, Week, Month, Stats, Settings (placeholders) e TestView
│        ├─ types/           # tree.ts
│        ├─ utils/           # errors.ts, form.ts
│        ├─ mocks/           # tree.ts (dados de exemplo)
│        └─ styles/          # tokens.css, base.css
├─ tests/setup/renderer.ts   # mock de window.api (testes ficam ao lado do código, *.test.ts)
├─ docs/                     # planejamento e componentes
├─ build/ e resources/       # ícones
├─ .github/workflows/ci.yml
├─ electron-builder.yml
├─ electron.vite.config.ts
├─ vitest.config.ts
└─ AGENTS.md e README.md
```

### 4.3 API exposta pelo preload (contrato)

```ts
interface Api {
  groups: {
    list(): Promise<Group[]>
    create(g: NewGroup): Promise<Group>
    update(id: number, g: Partial<Group>): Promise<Group>
    remove(id: number): Promise<void>
    reorder(ids: number[]): Promise<void>
  }
  habits: {
    list(): Promise<Habit[]>
    create(h: NewHabit): Promise<Habit>
    update(id: number, h: Partial<Habit>): Promise<Habit>
    remove(id: number): Promise<void>
    reorder(groupId: number | null, ids: number[]): Promise<void>
  }
  completions: {
    range(from: string, to: string): Promise<Completion[]>
    set(habitId: number, date: string, value: number, note?: string): Promise<Completion>
    clear(habitId: number, date: string): Promise<void>
  }
  stats: {
    habit(id: number): Promise<HabitStats>
    overview(from: string, to: string): Promise<Overview>
  }
  settings: { get(): Promise<Settings>; set(s: Partial<Settings>): Promise<Settings> }
  data: {
    exportJson(): Promise<string>
    importJson(path: string): Promise<void>
    backupNow(): Promise<string>
  }
}
```

### 4.4 Decisões de arquitetura

1. **Datas como string local `YYYY-MM-DD`.** Evita bugs de fuso e horário de verão; um check-in pertence a um dia do calendário, não a um instante.
2. **Streaks calculados, não armazenados.** Calculados a partir das conclusões e da frequência do hábito; assim editar o passado nunca deixa o streak inconsistente.
3. **Um check-in por (hábito, dia).** Chave única; `value` suporta hábitos de contador.
4. **Virada do dia.** Preferência "o dia começa às HH:MM" (padrão 00:00, útil para quem dorme tarde).
5. **Sem ORM e sem camada extra.** Repositórios simples com SQL preparado.

### 4.5 Convenções já implementadas

- Canais IPC no formato `dominio.acao` (ex.: `groups.list`), todos em `shared/ipc-channels.ts`.
- Todo handler do main passa por `handle()`: valida com Zod, devolve `IpcResult` (dados ou `message`), registra o detalhe no log e manda ao renderer só a mensagem legível. O preload desembrulha o resultado e lança um `Error`.
- Erros do SQLite (chave estrangeira, único, não nulo, check) viram mensagens em português em `ipc/errors.ts`.
- No renderer, `useToast` guarda um toast global e o `App.vue` converte `unhandledrejection` em toast; erros de formulário ficam dentro do modal.
- Formulários usam os mesmos schemas Zod do main; `toFieldErrors` gera um erro por campo e `focusFirstError` foca o primeiro, via atributo `data-field`.
- Em dev, a pasta `userData` ganha o sufixo `-dev` e `npm run dev:seed` cria 90 dias de dados determinísticos.
- Os testes do `main` rodam dentro do Electron (`ELECTRON_RUN_AS_NODE=1`), para usar o mesmo `better-sqlite3` do app; os do renderer rodam em jsdom.
- A rota `/test` (catálogo de componentes) e o botão DEV do cabeçalho só existem em desenvolvimento.

## 5. Design system

Baseado no print do app de notas: tema bege quente, tipografia monoespaçada, linhas de ícone finas, pastas coloridas em pastel, cantos arredondados e elementos "cartão" com sombra suave.

### 5.1 Princípios visuais

- Calmo e aconchegante, como um caderno de papel.
- Cor usada para organizar (cada grupo tem a sua), nunca para decorar.
- Tudo em monoespaçada; hierarquia por peso e cor, não por tamanho exagerado.
- Detalhes lúdicos discretos (divisor de estrelas e luas).

### 5.2 Tokens de cor (valores do tokens.css, partindo da imagem e ajustados para contraste)

| Token              | Valor                                                          | Uso                                  |
| ------------------ | -------------------------------------------------------------- | ------------------------------------ |
| `--bg`             | `#EFE6DD`                                                      | Fundo do app e da sidebar            |
| `--surface`        | `#F4ECE4`                                                      | Cartões, item selecionado, dropdown  |
| `--surface-border` | `#D9CFC5`                                                      | Borda de cartões e seleção           |
| `--text-title`     | `#4A3520`                                                      | Títulos (ex.: "notebook")            |
| `--text`           | `#6F5E4D`                                                      | Texto principal e itens              |
| `--text-muted`     | `#6B5A47`                                                      | Contadores, chevrons, ícones neutros |
| `--shadow`         | `0 2px 0 rgba(120,100,80,.25), 0 1px 4px rgba(120,100,80,.18)` | Cartão/seleção elevada               |

**Paleta de grupos** (texto/ícone + fundo pastel)

| Nome     | Texto/ícone | Fundo     |
| -------- | ----------- | --------- |
| Laranja  | `#9C3F1D`   | `#F0D6BE` |
| Amarelo  | `#7D5F07`   | `#F0E0BC` |
| Verde    | `#17613A`   | `#E3E0C8` |
| Vermelho | `#B03224`   | `#EFDAD3` |

Cores extras já definidas no `tokens.css`: Azul `#3F5F73` sobre `#D9E4EA`, Lilás `#6B4C8A` sobre `#E7DDF1` e Rosa `#9C3F5E` sobre `#F1DCE3`, somando 7 opções. Os tons de texto foram escurecidos para atingir contraste AA (4,5:1 ou mais) sobre o fundo pastel. A cor é escolhida ao criar o grupo.

### 5.3 Tipografia

- Família: **Courier Prime**, fallback `"Courier New", ui-monospace, monospace`.
- Escala: 12 (meta/contadores) · 14 (itens) · 16 (corpo) · 20 (título de seção) · 28 (título da tela).
- Título: peso 700, cor `--text-title`. Itens: peso 400. Itens ativos: 700.

### 5.4 Forma, espaçamento e movimento

- Raio: 12 px em linhas de grupo e cartões; 999 px em pílulas ativas.
- Espaçamento base de 4 px; linhas de lista com altura \~44 px e padding horizontal de 16 px.
- Hierarquia em árvore com linha-guia vertical de 1 px na cor do grupo, recuo de 24 px por nível.
- Movimento curto (120–180 ms, `ease-out`) em expandir/recolher, hover e marcar; respeitar `prefers-reduced-motion`.

### 5.5 Componentes-base

- **Cabeçalho do app:** título em negrito + chevron de troca (ex.: "habits ⌄"), subtítulo com contagem ("12 hábitos, 4 grupos") e engrenagem de configurações.
- **Seletor de visão:** caixa em cartão com setas ⌃⌄ ("Hoje / Semana / Mês / Estatísticas"), como o campo "Files" do print.
- **Linha de grupo:** fundo pastel, chevron de expandir, ícone de traço, nome na cor do grupo.
- **Linha de hábito:** ícone + nome; item selecionado vira cartão com borda e sombra suave.
- **Checkbox de hábito:** círculo vazio que preenche com a cor do grupo e um check animado.
- **Divisor decorativo:** `*.☆.☽.☆.☽.☆.*` ao final da lista.
- **Barra de ações inferior:** ícones de traço (novo hábito, novo grupo, ordenar, mostrar/ocultar sidebar, recolher tudo) com pílula de fundo no item ativo.
- **Modal/Drawer, Toast, Tooltip, Campo de texto, Seletor de cor e ícone, Empty state** no mesmo estilo.
- **Heatmap:** quadrados com raio pequeno, escala de 5 tons derivada da cor do grupo sobre `--surface`.

### 5.6 Layout da janela

- Sidebar de \~300 px com árvore de grupos e hábitos, no estilo do print, e toggle para mostrar/ocultar (botão e atalho Ctrl/Cmd+B); recolhida, a área principal ocupa a largura toda.
- Área principal com a visão selecionada (Hoje, Semana, Mês, Estatísticas).
- Largura mínima da janela: 880×600 px.
- Tema escuro quente (marrom café) previsto como evolução; os tokens já nascem como variáveis CSS para isso.

## 6. Modelo de dados

### 6.1 Diagrama lógico

```
groups 1 ──── N habits 1 ──── N completions
settings (chave/valor)
schema_migrations
```

### 6.2 Tabelas (SQLite)

```sql
CREATE TABLE groups (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  color      TEXT NOT NULL,          -- chave da paleta: orange, yellow, green, red...
  icon       TEXT NOT NULL,          -- nome do ícone lucide
  position   INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE habits (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id      INTEGER REFERENCES groups(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  icon          TEXT NOT NULL,
  kind          TEXT NOT NULL DEFAULT 'boolean' CHECK (kind IN ('boolean','counter')),
  target        INTEGER NOT NULL DEFAULT 1,       -- meta diária (contador)
  unit          TEXT,                              -- ex.: copos, páginas
  freq_type     TEXT NOT NULL DEFAULT 'daily' CHECK (freq_type IN ('daily','weekdays','times_per_week')),
  freq_days     TEXT,                              -- JSON: [1,3,5] (0=domingo)
  freq_times    INTEGER,                           -- para times_per_week
  reminder_time TEXT,                              -- 'HH:MM' ou NULL
  start_date    TEXT NOT NULL,                     -- 'YYYY-MM-DD'
  position      INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE completions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id   INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date       TEXT NOT NULL,                        -- 'YYYY-MM-DD'
  value      INTEGER NOT NULL DEFAULT 1,
  note       TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (habit_id, date)
);
CREATE INDEX idx_completions_date ON completions(date);
CREATE INDEX idx_habits_group ON habits(group_id, position);

CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL                              -- JSON
);

CREATE TABLE schema_migrations (
  version    INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### 6.3 Tipos compartilhados (TypeScript)

```ts
export type HabitKind = 'boolean' | 'counter'
export type FreqType = 'daily' | 'weekdays' | 'times_per_week'

export interface Group {
  id: number
  name: string
  color: GroupColor
  icon: string
  position: number
}

export interface Habit {
  id: number
  groupId: number | null
  name: string
  description?: string
  icon: string
  kind: HabitKind
  target: number
  unit?: string
  freqType: FreqType
  freqDays?: number[]
  freqTimes?: number
  reminderTime?: string
  startDate: string
  position: number
}

export interface Completion {
  id: number
  habitId: number
  date: string
  value: number
  note?: string
}

export interface Settings {
  dayStartsAt: string // 'HH:MM'
  weekStartsOn: 0 | 1
  notifications: boolean
  launchAtLogin: boolean
  minimizeToTray: boolean
  autoBackup: boolean
}
```

### 6.4 Regras de negócio

- Um hábito é "devido" em um dia se: `daily`, ou o dia da semana está em `freq_days`, ou (`times_per_week`) a semana ainda não atingiu `freq_times`.
- Um dia conta como concluído se `value >= target` (boolean: `target = 1`).
- **Streak** (daily/weekdays): dias devidos consecutivos concluídos, ignorando dias não devidos; hoje ainda em aberto não quebra a sequência.
- **Streak** (times\_per\_week): semanas consecutivas que atingiram a meta.
- **Taxa de conclusão:** concluídos ÷ devidos no período, a partir de `start_date`.
- Excluir grupo: hábitos ficam sem grupo (`SET NULL`) após confirmação.
- Importação valida tudo com Zod antes de tocar no banco e roda em uma transação única.

### 6.5 Backup e exportação

- Banco em `userData/habit-tracker.db` (WAL ligado).
- Backup automático diário (cópia do arquivo via API de backup do SQLite) em `userData/backups/`, mantendo os últimos 14.
- Export JSON com `version`, `groups`, `habits`, `completions`, `settings`.

## 7. Etapas de desenvolvimento

Estimativas para uma pessoa em tempo parcial. Cada fase termina em algo utilizável e testável. Convenções para todas as fases: commits pequenos, `vue-tsc` e ESLint passando, testes da fase escritos junto com o código.

| Fase | Nome                                    | Estimativa |
| ---- | --------------------------------------- | ---------- |
| 0    | Setup do projeto e fundações            | 2–3 dias   |
| 1    | Design system e shell do app            | 4–5 dias   |
| 2    | Camada de dados e IPC                   | 4–5 dias   |
| 3    | Grupos e hábitos (CRUD)                 | 5–6 dias   |
| 4    | Check-in diário (tela Hoje)             | 4–5 dias   |
| 5    | Visões semanal e mensal                 | 4–5 dias   |
| 6    | Estatísticas e streaks                  | 5–6 dias   |
| 7    | Configurações, backup e dados           | 3–4 dias   |
| 8    | Integração com o desktop                | 4–5 dias   |
| 9    | Qualidade, acessibilidade e performance | 4–5 dias   |
| 10   | Empacotamento e lançamento              | 3–4 dias   |

Total aproximado: 6–8 semanas.

### Fase 0 — Setup do projeto e fundações

**Status:** concluída. Node 24 (`.nvmrc`) e CI em `ubuntu-latest` com `format:check`, `lint`, `typecheck` e `test`; a matrix para Windows e macOS fica para a Fase 10.

**Objetivo:** ter um app Electron + Vue 3 + TS abrindo, com ferramentas de qualidade e estrutura de pastas prontas.

**Tarefas**

1. Criar o repositório e inicializar com electron-vite (template Vue + TypeScript).
2. Definir a estrutura de pastas da seção 4.2 (main, preload, shared, renderer).
3. Configurar `tsconfig` separados para main/preload e renderer, com alias `@shared`.
4. Configurar ESLint, Prettier e `vue-tsc` com scripts `lint`, `format` e `typecheck`.
5. Configurar Vitest e um teste de exemplo passando.
6. Ativar segurança do Electron: `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, CSP no `index.html`, bloquear navegação externa e `window.open`.
7. Instalar Pinia e Vue Router (hash mode) e montar a rota inicial.
8. Criar preload com `window.api` vazio e tipos declarados em `global.d.ts`.
9. Configurar GitHub Actions com lint + typecheck + testes.
10. Escrever README com como rodar, buildar e a estrutura.

**Entregáveis:** janela do Electron abrindo a tela inicial do Vue, `npm run dev` com HMR, CI verde.

**Critérios de aceite:** `npm run dev`, `lint`, `typecheck` e `test` passam; nenhuma API de Node acessível pelo DevTools do renderer.

**Riscos:** incompatibilidade de versões Electron/Node com módulos nativos → fixar versões desde já.

### Fase 1 — Design system e shell do app

**Status:** concluída. Há 18 componentes em `components/`, catálogo na rota `/test` (só em dev) e as 7 cores de grupo em `tokens.css`. O toggle da sidebar entra na Fase 3.

**Objetivo:** implementar o visual do print como biblioteca de componentes e montar o layout principal com dados fictícios.

**Tarefas**

1. Criar `tokens.css` com todas as variáveis da seção 5 (cores, tipografia, raio, sombra, espaçamento, movimento).
2. Embutir Courier Prime via `@fontsource` e definir fallback.
3. Criar estilos base (reset, scrollbar fina na cor do tema, seleção de texto, foco visível).
4. Construir componentes-base: `AppHeader`, `ViewSwitcher` (caixa com setas), `GroupRow`, `HabitRow`, `TreeGuide`, `IconButton`, `ActionBar`, `StarDivider`, `Modal`, `Toast`, `TextField`, `ColorPicker`, `IconPicker`, `EmptyState`.
5. Montar `SidebarTree` com expandir/recolher animado, linha-guia vertical na cor do grupo e item selecionado em cartão.
6. Montar o layout principal: sidebar 300 px + área de conteúdo + barra de ações inferior.
7. Criar página interna "Design system" (apenas em dev) listando todos os componentes e estados (normal, hover, ativo, foco, desabilitado).
8. Definir mapeamento nome-do-ícone → componente lucide e a paleta de grupos completa (inclui as cores extras).
9. Garantir contraste mínimo AA entre texto e fundo pastel; ajustar tons se necessário.

**Entregáveis:** shell navegável com dados mockados, visual fiel ao print, página de catálogo dos componentes.

**Critérios de aceite:** comparação lado a lado com o print sem diferenças perceptíveis de cor, fonte e espaçamento; expandir/recolher fluido; navegação por Tab funciona em toda a sidebar.

**Riscos:** ícones diferentes dos do print → aceitar lucide como aproximação e padronizar espessura do traço (1.75).

### Fase 2 — Camada de dados e IPC

**Status:** concluída (migração `001_init.sql`, repositórios, schemas Zod, handlers com `IpcResult`, preload tipado, seed e testes). Resta remover o código legado de arquivar, descrito em "Estado atual do repositório".

**Objetivo:** persistência confiável em SQLite com contrato IPC tipado e validado.

**Tarefas**

1. Instalar `better-sqlite3` e configurar rebuild para o Electron (`@electron/rebuild` / `electron-builder install-app-deps`).
2. Criar `connection.ts` abrindo `userData/habit-tracker.db` com `journal_mode = WAL` e `foreign_keys = ON`.
3. Criar o runner de migrações: lê `migrations/*.sql` em ordem, aplica em transação e registra em `schema_migrations`.
4. Escrever `001_init.sql` com as tabelas da seção 6.2.
5. ImpPrlementar repositórios (`groups`, `habits`, `completions`, `settings`) com statements preparados e retorno tipado.
6. Definir schemas Zod em `shared/schemas.ts` e usar nos handlers IPC.
7. Registrar handlers por domínio e canais em `ipc-channels.ts`.
8. Expor `window.api` no preload conforme a seção 4.3, sem expor `ipcRenderer`.
9. Criar camada `renderer/src/api.ts` que encapsula `window.api` para facilitar mocks em testes.
10. Criar seed de desenvolvimento (comando que popula grupos, hábitos e 90 dias de conclusões).
11. Tratamento de erros padronizado: handlers retornam erro serializável e o renderer mostra toast.
12. Testes unitários dos repositórios usando banco em memória.

**Entregáveis:** app lendo e gravando dados reais; seed funcionando; testes dos repositórios.

**Critérios de aceite:** reiniciar o app mantém os dados; payload inválido é rejeitado com erro claro; migrações rodam do zero e são idempotentes.

**Riscos:** falha no rebuild nativo em alguma plataforma → validar no CI (matrix) já nesta fase.

### Fase 3 — Grupos e hábitos (CRUD)

**Status:** em andamento. Feito: tarefas 1 a 5 e 12 (stores, sidebar com dados reais, modais de grupo e hábito, validação com Zod e contagem no cabeçalho), mais a edição de hábito pela barra de ações, o toggle da sidebar (com `Ctrl/Cmd+B`) e o tratamento do menu de contexto na sidebar. Faltam reordenar, mover entre grupos, excluir, o estado vazio e a edição de grupo pelo menu de contexto.

**Objetivo:** criar, editar e organizar grupos e hábitos pela interface.

**Tarefas**

1. Store Pinia `groups` e `habits` consumindo `window.api`.
2. Sidebar real: lista de grupos com seus hábitos, hábitos sem grupo em seção própria.
3. Modal "Novo/Editar grupo": nome, cor, ícone, com pré-visualização da linha.
4. Modal "Novo/Editar hábito": nome, descrição, grupo, ícone, tipo (feito/contador), meta e unidade, frequência (todo dia, dias da semana, X vezes por semana), data de início, lembrete.
5. Validação de formulário com Zod, mensagens em português e foco no primeiro erro.
6. Reordenar grupos e hábitos por arrastar e soltar (HTML5 nativo, ou `vuedraggable` se o nativo ficar complexo) e persistir `position`.
7. Mover hábito entre grupos.
8. Toggle da sidebar (mostrar/ocultar): estado `sidebarOpen` num store `ui`, guardado em `localStorage` dentro de `try/catch`. A ação `toggle-view` da `ActionBar`, que hoje emite o evento sem handler, vira "Mostrar/ocultar sidebar" com o ícone `panel-left` (novo em `icons.ts`). Quando a sidebar está recolhida, um botão fixo na área de conteúdo a reabre. Atalho `Ctrl/Cmd+B` em `useHotkeys`. No `.shell` a coluna da grid anima entre `var(--sidebar-width)` e `0`; a sidebar recolhida recebe `inert` e `aria-hidden`, e a animação respeita `prefers-reduced-motion`.
9. Excluir grupo e hábito com confirmação explicando o efeito (grupo: hábitos ficam sem grupo; hábito: apaga histórico).
10. Menu de contexto (botão direito) na sidebar: editar, excluir, duplicar.
11. Estado vazio acolhedor quando não há grupos ou hábitos, com ação para criar o primeiro.
12. Contagem no cabeçalho ("N hábitos, M grupos") atualizada em tempo real.

**Entregáveis:** gestão completa de grupos e hábitos persistida, com sidebar que pode ser ocultada.

**Critérios de aceite:** criar → editar → reordenar → excluir funciona sem recarregar; ordem persiste após reiniciar; testes dos stores passando; o toggle oculta e mostra a sidebar com animação e lembra a escolha ao reabrir o app.

**Riscos:** drag and drop com árvore aninhada → limitar a dois níveis (grupo → hábito).

### Fase 4 — Check-in diário (tela Hoje)

**Status:** não iniciada. Existem só placeholders: `TodayView.vue`, `stores/today.ts`, `useDate.ts` e `useHotkeys.ts`. O `shared/date.ts` já tem `toDateKey` e `addDays`.

**Objetivo:** o fluxo principal: ver o que é devido hoje e marcar em um clique.

**Tarefas**

1. Utilitário `useDate`: data de hoje respeitando `dayStartsAt`, formatação, início da semana conforme configuração.
2. Função pura `isDue(habit, date, completionsDaSemana)` com testes cobrindo as três frequências.
3. `TodayView`: lista de hábitos devidos agrupados por grupo, com cor do grupo e barra de progresso do dia ("5 de 8").
4. Checkbox animado para hábitos booleanos; clique alterna feito/não feito.
5. Controle de contador (− / valor / +) para hábitos de contador, com preenchimento parcial visual.
6. Nota opcional por check-in (popover), exibida como ícone na linha.
7. Navegação entre dias (anterior/próximo/hoje) para registrar dias passados; bloquear dias futuros.
8. Atualização otimista da UI com rollback em caso de erro no IPC.
9. Atalhos de teclado: setas para navegar, `Espaço` para marcar, `N` novo hábito, `T` ir para hoje.
10. Mensagem leve ao concluir tudo do dia (texto simples, sem confete).
11. Reservar o espaço da sequência atual ao lado do hábito (preenchido na Fase 6).

**Entregáveis:** tela Hoje funcional, check-in persistido.

**Critérios de aceite:** marcar/desmarcar leva um clique e reflete em menos de 100 ms; dia passado editável; `isDue` com testes cobrindo casos de borda (virada de semana, `start_date`).

**Riscos:** erros de data/fuso → testar com `TZ` diferentes no Vitest.

### Fase 5 — Visões semanal e mensal

**Status:** não iniciada (`WeekView.vue` e `MonthView.vue` são placeholders). O `completions.range` já existe no IPC.

**Objetivo:** enxergar padrões ao longo do tempo em grade e calendário.

**Tarefas**

1. `WeekView`: grade hábitos × dias da semana, células clicáveis para marcar/desmarcar, dias não devidos em tom neutro.
2. `MonthView`: calendário mensal com indicador de conclusão por dia (círculo preenchido proporcional ao % concluído).
3. Seleção de um hábito na sidebar filtra a visão para aquele hábito (mês com marcação dia a dia).
4. Clique em um dia do mês abre o detalhe daquele dia (lista de hábitos e notas).
5. Navegação anterior/próximo/hoje e seletor de mês e ano.
6. Carregar dados por intervalo (`completions.range`) com cache no store e invalidação ao marcar.
7. Respeitar `weekStartsOn` (domingo ou segunda).
8. Cores da grade derivadas da cor do grupo (5 níveis de intensidade).
9. Estado de carregamento (esqueleto) e estado vazio por período.

**Entregáveis:** visões semana e mês integradas à sidebar e ao ViewSwitcher.

**Critérios de aceite:** marcar na grade reflete na tela Hoje e vice-versa; mês com 31 dias e 20 hábitos renderiza sem lag perceptível; navegação entre meses sem piscar.

**Riscos:** muitas células reativas → usar `computed` por linha e evitar watchers profundos.

### Fase 6 — Estatísticas e streaks

**Status:** não iniciada. `StatsView.vue`, `services/stats.ts`, `ipc/stats.ts` e `useStreaks.ts` são placeholders. Os tipos `HabitStats` e `Overview` e o contrato `window.api.stats` já estão declarados, mas o main ainda não registra os handlers.

**Objetivo:** transformar o histórico em informação motivadora e simples.

**Tarefas**

1. Implementar `calcStreak` (atual e maior) para `daily`, `weekdays` e `times_per_week`, como funções puras em `shared/` com testes extensos.
2. Implementar taxa de conclusão por período (7, 30, 90 dias e total desde `start_date`).
3. Serviço `stats` no main (consultas agregadas em SQL) e handlers `stats.habit` e `stats.overview`.
4. Exibir streak atual (ícone de chama em traço) na tela Hoje e na sidebar.
5. `StatsView` com visão geral: conclusão do período, melhor dia da semana, hábitos mais e menos consistentes.
6. Detalhe por hábito: streak atual, maior streak, total de conclusões, taxa e gráfico de barras semanal em SVG.
7. Heatmap anual por hábito (estilo "quadradinhos") em SVG, com tooltip de data e valor.
8. Seletor de período e filtro por grupo.
9. Revisar desempenho: índices usados, consultas medidas com 3 anos de dados de seed (≈ 20 hábitos).

**Entregáveis:** tela de estatísticas e streaks visíveis em todo o app.

**Critérios de aceite:** streaks corretos nos casos de teste (pular dia não devido, hoje em aberto, mudança de frequência); estatísticas calculam em menos de 200 ms com 3 anos de dados.

**Riscos:** mudança de frequência no meio do histórico → documentar a regra (a frequência atual vale para todo o histórico no MVP).

### Fase 7 — Configurações, backup e dados

**Status:** não iniciada. `SettingsView.vue`, `stores/settings.ts`, `ipc/data.ts` e `services/backup.ts` são placeholders. O repositório e o IPC de `settings` já funcionam, com `DEFAULT_SETTINGS` em `shared/defaults.ts` (a semana começa no domingo).

**Objetivo:** dar controle e segurança sobre os dados.

**Tarefas**

1. `SettingsView` (aberta pela engrenagem do cabeçalho) com seções: Geral, Aparência, Notificações, Dados.
2. Persistir `dayStartsAt`, `weekStartsOn`, `notifications`, `launchAtLogin`, `minimizeToTray`, `autoBackup` na tabela `settings`.
3. Backup automático diário com a API de backup do SQLite, retenção dos últimos 14 e botão "Fazer backup agora".
4. Exportar JSON (diálogo nativo "Salvar como").
5. Importar JSON: diálogo nativo, validação Zod, prévia (quantidade de itens) e confirmação, em transação única com rollback.
6. Restaurar a partir de um backup da lista.
7. Botão para abrir a pasta de dados no explorador do sistema.
8. Opção "Apagar todos os dados" com dupla confirmação.
9. Testes de round-trip: exportar → limpar → importar → dados idênticos.

**Entregáveis:** configurações persistidas, backup/export/import funcionando.

**Critérios de aceite:** importação inválida não altera nada; round-trip sem perda; backups aparecem na pasta com rotação correta.

**Riscos:** versão futura do esquema → incluir `version` no JSON e função de migração do import.

### Fase 8 — Integração com o desktop

**Status:** não iniciada (`services/tray.ts` e `services/notifications.ts` são placeholders).

**Objetivo:** fazer o app se comportar como um app desktop de verdade.

**Tarefas**

1. Ícone na bandeja (tray) com menu: abrir, marcar hábitos de hoje (submenu), sair.
2. Minimizar para a bandeja ao fechar a janela (configurável) e instância única (`requestSingleInstanceLock`).
3. Notificações nativas de lembrete usando `reminder_time` de cada hábito; agendador no main que sobrevive ao app minimizado; não notificar hábito já concluído no dia.
4. Clicar na notificação abre a tela Hoje.
5. Iniciar com o sistema (`setLoginItemSettings`) conforme configuração.
6. Menu nativo da aplicação e atalho global opcional (ex.: abrir check-in rápido).
7. Persistir tamanho, posição e estado maximizado da janela.
8. Badge/contador de pendentes no ícone onde suportado (macOS/Linux) e tooltip na bandeja.
9. Tratar suspensão e retomada do sistema (`powerMonitor`) para recalcular "hoje" e agendamentos.
10. Ajustes por plataforma: barra de título, ícones, comportamento de fechar no macOS.

**Entregáveis:** app que vive na bandeja, lembra e inicia com o sistema.

**Critérios de aceite:** lembrete dispara no horário e não dispara se já concluído; segunda instância apenas foca a janela; virar a meia-noite com o app aberto atualiza o "hoje".

**Riscos:** diferenças entre sistemas operacionais → testar manualmente em pelo menos Windows e uma plataforma Unix.

### Fase 9 — Qualidade, acessibilidade e performance

**Status:** parcial. Há 7 arquivos de teste (shared, main e renderer) rodando no CI; os do main usam o Electron como Node (`ELECTRON_RUN_AS_NODE`). Faltam Playwright (e2e), auditoria de acessibilidade, `electron-log` e testes de componentes.

**Objetivo:** estabilizar, polir e proteger contra regressões.

**Tarefas**

1. Cobertura de testes unitários nas regras de negócio (`isDue`, streaks, estatísticas, importação).
2. Testes de componentes principais com Vitest + Vue Test Utils (HabitRow, SidebarTree, modais).
3. Testes e2e com Playwright para Electron: criar grupo → criar hábito → marcar hoje → ver na semana → exportar.
4. Auditoria de acessibilidade: ordem de foco, `aria-label` em botões de ícone, `role="checkbox"` com estado, contraste AA, `prefers-reduced-motion`.
5. Navegação completa por teclado, incluindo menus e modais (focus trap e `Esc`).
6. Medir tempo de inicialização e uso de memória; adiar o que não é necessário na abertura.
7. Revisão de segurança: CSP, validação de todos os canais IPC, nenhuma URL externa carregada, `webPreferences` revisadas.
8. Log de erros em arquivo (`electron-log`) e tela simples de "Algo deu errado" com opção de copiar detalhes.
9. Revisão visual contra o print e correção de inconsistências.
10. Remover código morto e simplificar abstrações que não se pagaram.

**Entregáveis:** suíte de testes estável, checklist de acessibilidade concluído, relatório de performance.

**Critérios de aceite:** CI com unit + e2e verdes; abertura em menos de 2 s; nenhum erro não tratado no console durante o fluxo e2e.

**Riscos:** e2e instável → usar seletores por `data-testid` e esperas explícitas por estado.

### Fase 10 — Empacotamento e lançamento

**Status:** não iniciada. O `electron-builder.yml` ainda tem os valores do template: `appId` `com.electron.app`, `publish` apontando para example.com, textos de permissão de câmera e microfone no macOS, espelho de download e alvo `snap`. Ajustar nesta fase.

**Objetivo:** gerar instaladores e publicar a primeira versão.

**Tarefas**

1. Criar ícones do app (`.ico`, `.icns`, `.png`) seguindo a identidade bege/monoespaçada.
2. Configurar `electron-builder.yml`: `appId`, nome do produto, alvos (NSIS no Windows, DMG no macOS, AppImage e deb no Linux), `asarUnpack` do módulo nativo do SQLite.
3. Garantir que o rebuild do `better-sqlite3` rode no build de cada plataforma.
4. Workflow do GitHub Actions: matrix win/mac/linux gerando artefatos em tags `v*`.
5. Assinatura de código: Windows (certificado, se disponível) e macOS (notarização, se houver conta de desenvolvedor); documentar o aviso do SmartScreen/Gatekeeper caso não assine.
6. Auto-update opcional via `electron-updater` com GitHub Releases (avaliar se vale a complexidade para uso pessoal).
7. Testar instalação limpa, atualização sobre versão anterior (migrações) e desinstalação em cada sistema.
8. Versionamento semântico, `CHANGELOG.md` e release `v1.0.0` com instaladores anexados.
9. Atualizar o README com capturas de tela, instalação e como contribuir.

**Entregáveis:** instaladores para os três sistemas e release publicada.

**Critérios de aceite:** instalar em máquina limpa, abrir, criar hábito, fechar, reabrir e ver os dados; atualizar de uma versão para outra sem perder dados.

**Riscos:** tamanho do instalador (\~100 MB) e avisos de assinatura → aceitável para uso pessoal; Tauri fica como opção futura se o peso incomodar.

## 8. Roadmap pós-MVP

1. Tema escuro quente.
2. Sincronização por arquivo em pasta na nuvem.
3. Tags, filtros e busca.
4. Múltiplos lembretes por hábito e hábitos com horário.
5. Relatório semanal/mensal exportável.
6. Avaliar migração para Tauri.

## 9. Riscos gerais

| Risco                                            | Impacto | Mitigação                                       |
| ------------------------------------------------ | ------- | ----------------------------------------------- |
| Módulo nativo SQLite quebrando entre plataformas | Alto    | Matrix no CI desde a Fase 2                     |
| Bugs de data/fuso/virada do dia                  | Alto    | Datas como string local, testes com vários `TZ` |
| Escopo crescendo                                 | Médio   | Fases curtas, itens extras só no roadmap        |
| Perda de dados                                   | Alto    | WAL, transações, backup diário, import validado |
| Tamanho do app                                   | Baixo   | Aceitar; Tauri como alternativa futura          |

## 10. Definição de pronto (MVP)

- Todas as fases 0–10 com critérios de aceite cumpridos.
- Fluxo "criar hábito → marcar hoje → ver streak → exportar" funcionando nos três sistemas.
- Visual conferido contra o design system do print.
- Testes unitários e e2e verdes no CI.
- Instaladores publicados na release `v1.0.0`.

_.☆.☽.☆.☽.☆._
