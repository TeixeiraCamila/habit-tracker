// Ponte segura entre o renderer e o processo principal.
// Expõe apenas window.api; não libera acesso genérico ao ipcRenderer.
import type { Api } from '@shared/api'
import { contextBridge } from 'electron'

const api: Api = {}

contextBridge.exposeInMainWorld('api', api)
