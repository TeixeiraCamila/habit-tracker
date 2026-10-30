# AGENTS.md

Guia para agentes que trabalham neste repositório. O plano completo do produto está em
[`docs/Habit Tracker — Planejamento.md`](docs/Habit%20Tracker%20—%20Planejamento.md) e deve ser
consultado antes de implementar funcionalidades.

## Visão geral

Aplicativo desktop pessoal, local-first e offline, para acompanhar hábitos diários. Electron +
Vue 3 + TypeScript, empacotado com electron-vite. Os dados ficam em SQLite na máquina da pessoa
usuária; não há conta, servidor ou nuvem.

Stack prevista pelo planejamento: Vue 3 (Composition API, `<script setup>`), Pinia, Vue Router
(hash mode), SQLite via better-sqlite3, Zod, date-fns, lucide-vue-next, Vitest e Playwright.
No estado atual, apenas a base do electron-vite (Vue + TS) está instalada — as dependências das
próximas fases ainda não foram adicionadas.

## Comandos

```bash
npm install          # instala dependências (roda postinstall do Electron)
npm run dev          # electron-vite dev (main + preload + renderer com HMR)
npm run typecheck    # tsc (main/preload/shared) + vue-tsc (renderer/shared)
npm run lint         # ESLint com cache
npm run format       # Prettier --write
npm run build        # typecheck + electron-vite build
npm run start        # electron-vite preview do build
npm run build:win    # instalador Windows
npm run build:mac    # instalador macOS
npm run build:linux  # instalador Linux
```

Sempre rode `npm run typecheck` e `npm run lint` antes de considerar uma mudança pronta. O build
também roda o typecheck.

## Estrutura

```
src/
├─ main/                 # processo principal do Electron (Node)
│  ├─ index.ts           # janela, ciclo de vida do app
│  ├─ paths.ts           # userData, backups
│  ├─ db/                # conexão SQLite, runner de migrações, migrations/*.sql
│  ├─ repositories/      # acesso a dados com SQL preparado
│  ├─ ipc/               # handlers IPC por domínio
│  └─ services/          # stats, backup, notifications, tray
├─ preload/              # contextBridge -> window.api (+ index.d.ts)
├─ shared/               # tipos, schemas Zod e nomes de canais IPC
└─ renderer/
   ├─ index.html
   └─ src/
      ├─ main.ts, App.vue
      ├─ router/, stores/, composables/, components/, views/
      └─ styles/            # tokens.css (variáveis), base.css (reset)
```

`tests/` é reservado para testes unitários (Vitest) e e2e (Playwright). `build/` contém ícones e
recursos do empacotamento; `resources/` contém recursos usados em runtime.

### Estado atual

Muitos arquivos da estrutura existem como placeholders vazios (por exemplo `src/shared/types.ts`,
`src/main/db/*`, stores e views). Eles marcam a estrutura planejada e devem ser preenchidos conforme
as fases do documento de planejamento, sem criar uma organização paralela.

## Arquitetura e regras

- **Main é o único dono do banco.** Todo acesso a SQLite, migrações, backup, notificações e bandeja
  vive no processo principal.
- **Renderer nunca acessa Node/SQLite diretamente.** A comunicação acontece apenas via
  `window.api`, exposto pelo preload com `contextBridge`. Não exponha `ipcRenderer` genérico.
- **Preload mínimo e tipado.** O contrato de `window.api` está na seção 4.3 do planejamento e deve
  ser declarado em `src/preload/index.d.ts`.
- **Valide payloads IPC com Zod** em `src/shared/schemas.ts`; erros devem ser serializáveis e
  exibidos como toast no renderer.
- **Sem ORM.** Use SQL preparado nos repositórios e migrações `.sql` numeradas.
- **Datas são strings locais `YYYY-MM-DD`**, não instantes. Isso evita bugs de fuso e horário de
  verão. A virada do dia respeita a configuração `dayStartsAt`.
- **Streaks e estatísticas são calculados**, nunca armazenados.
- **Arquivar em vez de apagar** hábitos; exclusão definitiva exige confirmação explícita.
- **Um check-in por (hábito, dia)**; a coluna `value` cobre hábitos do tipo contador.
- **Segurança do Electron:** `contextIsolation` ligado, `nodeIntegration` desligado, CSP no
  `index.html`, navegação externa e `window.open` bloqueados.
- **Local-first:** nenhuma funcionalidade pode depender de rede.

## Aliases de importação

Configurados em `electron.vite.config.ts` (bundler) e nos dois tsconfigs (tipos):

| Alias         | Destino              | Onde                     |
| ------------- | -------------------- | ------------------------ |
| `@shared/*`   | `src/shared/*`       | main, preload e renderer |
| `@renderer/*` | `src/renderer/src/*` | renderer                 |

Use os aliases em vez de caminhos relativos longos:

```ts
import type { Habit } from '@shared/types'
```

Ao adicionar um novo alias, atualize **os três lugares**: `electron.vite.config.ts`,
`tsconfig.node.json` e `tsconfig.web.json`.

## Por que dois tsconfigs?

O `tsconfig.json` da raiz não compila nada: ele apenas referencia dois projetos. Main e preload
compartilham o `tsconfig.node.json`; o `tsconfig.web.json` atende o renderer. A divisão real é
**Node (main/preload) × browser (renderer)**, não main × preload.

- **`tsconfig.node.json`:** estende a variante Node do `@electron-toolkit/tsconfig` e adiciona
  `types: ["electron-vite/node"]` (tipos de Node, Electron e do ambiente Vite). Inclui `src/main`,
  `src/preload`, `src/shared`, as configs do Vite/Vitest e o setup dos testes. É checado com `tsc`.
- **`tsconfig.web.json`:** estende a variante web e declara as libs `ESNext`, `DOM` e
  `DOM.Iterable`. Inclui `src/renderer/src`, `src/shared` e `src/preload/*.d.ts` (só as
  declarações de `window.api`). É checado com `vue-tsc`, que entende arquivos `.vue`.

Motivos para separar:

1. **Ambientes diferentes:** main/preload rodam no Node/Electron; o renderer roda no Chromium. A
   config web adiciona as libs de DOM usadas pelos componentes Vue.
2. **Ferramentas diferentes:** SFCs `.vue` precisam de `vue-tsc`; `tsc` puro não as interpreta.
3. **Includes diferentes:** evita checar views `.vue` com a config de Node e evita arrastar código
   de main para o typecheck do renderer.
4. **Contrato compartilhado:** `src/shared` entra nos dois projetos, então o mesmo tipo precisa ser
   válido nos dois contextos.

Os dois usam `composite: true` para funcionar como project references. Por isso `npm run typecheck`
executa os dois passos: um erro de tipo ou de alias pode aparecer em apenas um dos lados.

## Modelo de dados

Tabelas: `groups`, `habits`, `completions`, `settings`, `schema_migrations`. O DDL completo, os
tipos compartilhados e as regras de negócio (frequência, dia devido, conclusão, streak, taxa) estão
nas seções 6.2 a 6.4 do planejamento. Resumo:

- `groups` 1—N `habits` 1—N `completions`.
- `settings` é chave/valor com JSON.
- Migrações rodam em ordem, em transação, e são registradas em `schema_migrations`.

## Estilo de código e UI

- TypeScript estrito (`strict`, `noUnusedLocals`, `noUnusedParameters`).
- Prettier: aspas simples, sem ponto e vírgula, largura 100, sem vírgula final.
- Vue: `<script setup lang="ts">`; componentes em PascalCase.
- ESLint: `@electron-toolkit` + `eslint-plugin-vue` (flat config). Não desative regras sem motivo.
- UI segue o design system da seção 5 do planejamento: tema bege quente, Courier Prime
  monoespaçada, paleta pastel por grupo, raios de 12 px, sombra suave, movimento curto e respeito a
  `prefers-reduced-motion`. Use os tokens CSS em `src/renderer/src/styles/tokens.css` (importado
  junto com `base.css` em `main.ts`) em vez de cores/medidas soltas.
- Textos de interface em português.

## Comentários

- Arquivos ligados ao Electron (main, preload, configs do electron-vite/builder e entrada do
  renderer) devem começar com um comentário em português explicando o que são e o que fazem.
- Mantenha cada comentário com no máximo 3 linhas e prefira explicar o "porquê" em vez de repetir
  o código.
- Use o mesmo padrão em funções ou blocos não óbvios; comentários de linha devem ser curtos e
  objetivos.

## Fluxo de trabalho

1. Leia a fase correspondente no planejamento antes de implementar.
2. Mantenha mudanças pequenas e focadas; siga a estrutura existente.
3. Ao mexer em IPC: atualize tipo compartilhado, schema Zod, handler no main, preload e declaração
   de `window.api` na mesma mudança.
4. Rode `npm run typecheck` e `npm run lint`.
5. Para mudanças de UI, valide com `npm run dev` (HMR) e confira os estados de foco, vazio e erro.

## Armadilhas conhecidas

- `better-sqlite3` é módulo nativo: precisa de rebuild para a versão do Electron
  (`electron-builder install-app-deps`, já no `postinstall`, ou `@electron/rebuild`).
- `npm run dev` abre uma janela Electron; em ambientes sem display pode falhar, mas o Vite ainda
  reporta erros de build/resolução no terminal.
- O alias `@shared` também é usado pelo preload; mantenha-o nos três blocos de
  `electron.vite.config.ts`.
