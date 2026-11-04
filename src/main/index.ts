// Processo principal do Electron: cria a janela, aplica a segurança e controla o ciclo de vida.
// Também concentra banco, IPC e serviços do sistema; o renderer nunca executa este código.
import { app, BrowserWindow, session } from 'electron'
import { join } from 'path'
import { pathToFileURL } from 'url'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { migrate } from './db/migrate'
import { closeDb, initDb } from './db/connection'
import { dbPath } from './paths'

// Só a própria UI do app pode ser carregada na janela.
function isAppUrl(rawUrl: string): boolean {
  const devUrl = process.env['ELECTRON_RENDERER_URL']
  if (is.dev && devUrl) {
    try {
      return new URL(rawUrl).origin === new URL(devUrl).origin
    } catch {
      return false
    }
  }
  return rawUrl.startsWith(pathToFileURL(join(__dirname, '../renderer/')).href)
}

function createWindow(): void {
  // Cria a janela principal com o tamanho mínimo definido no planejamento.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 880,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      // Isola o renderer do Node e do sistema operacional.
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  mainWindow.on('ready-to-show', () => mainWindow.show())

  // Bloqueia window.open e links com target="_blank".
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))

  // Bloqueia navegação e redirecionamentos para fora do app.
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isAppUrl(url)) event.preventDefault()
  })

  mainWindow.webContents.on('will-redirect', (event, url) => {
    if (!isAppUrl(url)) event.preventDefault()
  })

  // Bloqueia a criação de <webview>.
  mainWindow.webContents.on('will-attach-webview', (event) => event.preventDefault())

  // Em dev carrega o servidor do Vite; em produção, o HTML compilado.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Executa a inicialização quando o Electron termina de carregar.
app
  .whenReady()
  .then(async () => {
    // Identifica o app no Windows para agrupamento e notificações.
    electronApp.setAppUserModelId('com.electron')

    // Mantém os atalhos padrão de devtools e recarregamento em desenvolvimento.
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    // Nega qualquer permissão pedida pelo renderer (câmera, geolocalização etc.).
    session.defaultSession.setPermissionRequestHandler((_wc, _permission, callback) =>
      callback(false)
    )

    // Abre o banco (cria o arquivo se ainda não existir) e aplica o schema.
    migrate(initDb(dbPath()))
    createWindow()

    // No macOS, recria a janela quando o ícone do dock é clicado.
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
  .catch((error: Error) => {
    // Falha no boot (banco/janela) não deve ficar como unhandled rejection.
    console.error('Falha na inicialização do app:', error)
  })

app.on('before-quit', () => closeDb()) // Fecha o banco antes de sair do app.

// Fecha o app quando todas as janelas são fechadas, exceto no macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
