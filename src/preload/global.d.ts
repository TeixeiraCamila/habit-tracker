// Tipos de window.api usados pelo renderer; mantenha em sincronia com index.ts.
import type { Api } from '@shared/api'

declare global {
  interface Window {
    api: Api
  }
}

export {}
