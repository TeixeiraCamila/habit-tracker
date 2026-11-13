// Store do UI: controla a sidebar (Fase 3) e persiste a preferência do app.
import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'habit-tracker.sidebar'

function readInitial(): boolean {
  try {
    // preferência salva; fallback para sidebar aberta
    return localStorage.getItem(STORAGE_KEY) !== '0'
  } catch {
    // localStorage indisponível (ex.: teste/jsdom sem mock): assume aberto
    return true
  }
}

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(readInitial())

  function persist(open: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEY, open ? '1' : '0')
    } catch {
      // sem persistência não trava a preferência da sessão
    }
  }

  function setOpen(open: boolean): void {
    sidebarOpen.value = open
    persist(open)
  }

  function toggleSidebar(): void {
    setOpen(!sidebarOpen.value)
  }

  persist(sidebarOpen.value)

  return { sidebarOpen, setOpen, toggleSidebar }
})
