// Atalhos do renderer: ignoram campos de texto e modais para não roubar teclas.
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export interface HotkeyHandlers {
  newHabit: () => void
  today: () => void
  previousDay: () => void
  nextDay: () => void
  toggleFirst: () => void
}

export function useHotkeys(handlers: HotkeyHandlers): void {
  const router = useRouter()

  function onKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey) return
    const target = event.target as HTMLElement | null
    if (target?.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]'))
      return

    const key = event.key.toLowerCase()
    if (key === 'n') {
      event.preventDefault()
      handlers.newHabit()
      return
    }
    if (key === 't') {
      event.preventDefault()
      handlers.today()
      return
    }
    if (router.currentRoute.value.name !== 'today') return

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      handlers.previousDay()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      handlers.nextDay()
    } else if (event.key === ' ' && !target?.closest('button, a, [role="checkbox"]')) {
      event.preventDefault()
      handlers.toggleFirst()
    }
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
}
