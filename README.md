# Habit Tracker

Aplicativo desktop **local-first** para acompanhar hábitos diários, sequências (streaks) e
progresso. Tudo fica no próprio computador: sem conta, servidor ou nuvem.

> **Status:** Fase 0 concluída: Electron + Vue 3 + TypeScript, Pinia, Vue Router, Vitest e CI.
> Persistência, telas e demais recursos entram conforme o
> [planejamento](docs/Habit%20Tracker%20%E2%80%94%20Planejamento.md).

## Stack

- **Desktop:** Electron + electron-vite
- **UI:** Vue 3 (Composition API, `<script setup>`) + TypeScript
- **Estado e rotas:** Pinia + Vue Router (hash mode)
- **Qualidade:** ESLint, Prettier, `vue-tsc` e Vitest
- **CI:** GitHub Actions
- **Planejado:** SQLite (better-sqlite3), Zod, date-fns e lucide-vue-next

## Requisitos

- Node.js 24 (definido em `.nvmrc`); o Vite exige `^20.19` ou `>=22.12`
- npm
- Linux, macOS ou Windows

## Como rodar

Pré-requisito: instalar as dependências uma vez.

```bash
npm install
```

O `postinstall` prepara o Electron e as dependências nativas. Depois, inicie o app em
desenvolvimento:

```bash
npm run dev
```

O `dev` sobe o Vite e abre a janela do Electron com HMR no renderer. Alterações em `src/renderer`
recarregam na hora; mudanças em `src/main` e `src/preload` são recompiladas e reiniciam o app.

## Como buildar

O build de produção roda o typecheck antes de compilar main, preload e renderer:

```bash
npm run build
```

O resultado fica em `out/`:

```text
out/
├─ main/       # processo principal compilado
├─ preload/    # preload compilado
└─ renderer/   # HTML, CSS e JS do renderer
```

Para abrir o build localmente antes de empacotar:

```bash
npm run start
```

### Instaladores

O `electron-builder` gera os instaladores em `dist/`:

```bash
npm run build:win     # Windows (NSIS)
npm run build:mac     # macOS (DMG)
npm run build:linux   # Linux (AppImage, snap e deb)
```

Para gerar apenas a pasta da aplicação, sem instalador:

```bash
npm run build:unpack
```

Os instaladores devem ser gerados no sistema de destino ou em CI: não há cross-compile confiável
para macOS e Windows a partir do Linux.

## Scripts

| Comando                 | Descrição                                   |
| ----------------------- | ------------------------------------------- |
| `npm run dev`           | Inicia o app em desenvolvimento com HMR     |
| `npm run typecheck`     | Checa tipos do main/preload e do renderer   |
| `npm run lint`          | Roda o ESLint                               |
| `npm run lint:fix`      | Roda o ESLint corrigindo o que for possível |
| `npm test`              | Roda os testes unitários                    |
| `npm run test:watch`    | Roda os testes em modo watch                |
| `npm run test:coverage` | Roda os testes com cobertura                |
| `npm run format`        | Formata o projeto com Prettier              |
| `npm run format:check`  | Verifica a formatação sem alterar arquivos  |
| `npm run build`         | Typecheck + build de produção               |
| `npm run start`         | Pré-visualiza o build                       |
| `npm run build:unpack`  | Gera a pasta da aplicação sem instalador    |
| `npm run build:win`     | Gera o instalador para Windows              |
| `npm run build:mac`     | Gera o instalador para macOS                |
| `npm run build:linux`   | Gera o instalador para Linux                |

O workflow em `.github/workflows/ci.yml` roda `format:check`, `lint`, `typecheck` e `test` em
pushes para `main` e pull requests.

## Estrutura

```text
src/
├─ main/                  # processo principal (Node/Electron)
│  ├─ index.ts            # janela, segurança e ciclo de vida
│  ├─ paths.ts            # userData, banco e backups
│  ├─ db/                 # conexão SQLite e migrações .sql
│  ├─ repositories/       # acesso a dados com SQL preparado
│  ├─ ipc/                # handlers IPC por domínio
│  └─ services/           # estatísticas, backup, notificações e bandeja
├─ preload/               # ponte segura para window.api
│  ├─ index.ts            # expõe o contrato via contextBridge
│  └─ global.d.ts         # tipos de window.api usados no renderer
├─ shared/                # tipos, schemas Zod e nomes de canais IPC
└─ renderer/              # interface Vue 3
   ├─ index.html          # HTML e CSP do renderer
   └─ src/
      ├─ main.ts          # monta Vue, Pinia e Vue Router
      ├─ App.vue          # layout raiz e navegação
      ├─ router/          # rotas em hash mode
      ├─ stores/          # estado com Pinia
      ├─ composables/     # lógica reutilizável
      ├─ components/      # componentes Vue
      ├─ views/           # telas (Hoje, Semana, Mês, Estatísticas, Configurações)
      └─ styles/          # tokens.css e base.css
```

Fora de `src/`:

```text
tests/       # testes unitários (Vitest) e e2e (Playwright)
build/       # ícones e recursos do empacotamento
resources/   # recursos usados em runtime
out/         # build do electron-vite (gerado)
dist/        # instaladores do electron-builder (gerado)
```

- `src/main` é o único que acessa o sistema operacional e o banco.
- `src/preload` expõe uma API mínima e tipada para o renderer.
- `src/renderer` contém apenas UI e estado.
- `src/shared` é importado pelos dois lados pelos aliases.

## Aliases

| Alias         | Destino              |
| ------------- | -------------------- |
| `@shared/*`   | `src/shared/*`       |
| `@renderer/*` | `src/renderer/src/*` |

Configurados em `electron.vite.config.ts`, `tsconfig.node.json` e `tsconfig.web.json`.

## Dados e privacidade

Os dados ficarão em SQLite dentro do diretório `userData` do app. O planejamento prevê backup
automático, exportação/importação em JSON e nenhuma dependência de rede. Datas são tratadas como
strings locais `YYYY-MM-DD` para evitar problemas de fuso.

## Documentação

- [Planejamento do produto](docs/Habit%20Tracker%20%E2%80%94%20Planejamento.md) — escopo,
  arquitetura, modelo de dados, design system e fases.
- [AGENTS.md](AGENTS.md) — convenções e instruções para agentes e contribuidores.

## Roadmap

| Fase | Entrega                                 |
| ---- | --------------------------------------- |
| 0    | Setup, ferramentas e estrutura          |
| 1    | Design system e shell do app            |
| 2    | Camada de dados e IPC                   |
| 3    | CRUD de grupos e hábitos                |
| 4    | Check-in diário (tela Hoje)             |
| 5    | Visões semanal e mensal                 |
| 6    | Estatísticas e streaks                  |
| 7    | Configurações, backup e dados           |
| 8    | Integração com o desktop                |
| 9    | Qualidade, acessibilidade e performance |
| 10   | Empacotamento e lançamento              |

## Convenções

- TypeScript estrito; rode `npm run typecheck` e `npm test` antes de commitar.
- Prettier: aspas simples, sem ponto e vírgula, largura 100.
- Textos de interface em português.
- Use os tokens de `src/renderer/src/styles/tokens.css` e o reset de `base.css`.
- Mudanças de IPC devem atualizar tipos, schema, handler, preload e `window.api` na mesma alteração.
