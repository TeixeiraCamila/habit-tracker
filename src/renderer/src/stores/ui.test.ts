import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUiStore } from './ui'

describe('useUiStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('abre a sidebar por padrão', () => {
    expect(useUiStore().sidebarOpen).toBe(true)
  })

  it('alterna e persiste a preferência', () => {
    const ui = useUiStore()
    ui.toggleSidebar()
    expect(ui.sidebarOpen).toBe(false)

    expect(useUiStore().sidebarOpen).toBe(false)
    ui.toggleSidebar()
    expect(useUiStore().sidebarOpen).toBe(true)

    ui.setOpen(false)
    expect(useUiStore().sidebarOpen).toBe(false)
    expect(localStorage.getItem('habit-tracker.sidebar')).toBe('0')
  })
})
