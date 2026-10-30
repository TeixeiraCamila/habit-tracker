// Tipos de window.api usados pelo renderer; mantenha em sincronia com index.ts.
declare global {
  interface Window {
    api: Record<string, never>
  }
}
