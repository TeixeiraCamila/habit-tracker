import { Api } from '@shared/api'

// Tipos de window.api usados pelo renderer; mantenha em sincronia com index.ts.
declare global {
  interface Window {
    api: Api
  }
}

export {}
