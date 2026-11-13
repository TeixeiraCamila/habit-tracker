// Atalhos de teclado do renderer, ex.: Ctrl/Cmd+B alterna a sidebar.
import { onMounted, onUnmounted } from 'vue'
import { useUiStore } from '@renderer/stores/ui'

export function useHotkeys(): void {
  const ui = useUiStore()

  function onKeydown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase()
    if ((event.ctrlKey || event.metaKey) && key === 'b') {
      event.preventDefault()
      ui.toggleSidebar()
    }
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onUnmounted(() => window.removeEventListener('keydown', onKeydown))
}
