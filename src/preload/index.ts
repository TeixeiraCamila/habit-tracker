// Ponte segura entre o renderer e o processo principal.
// Expõe apenas window.api; não libera acesso genérico ao ipcRenderer.
import { contextBridge } from 'electron'

const api = {}

contextBridge.exposeInMainWorld('api', api)
