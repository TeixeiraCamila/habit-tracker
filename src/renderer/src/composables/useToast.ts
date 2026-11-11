// Estado do toast global: todos os componentes compartilham a mesma mensagem.
import { ref, type Ref } from 'vue'

export type ToastKind = 'success' | 'error'

export interface ToastState {
  id: number
  message: string
  kind: ToastKind
}

export interface UseToastReturn {
  toast: Ref<ToastState | null>
  success: (message: string) => void
  error: (message: string) => void
  dismiss: () => void
}

const toast = ref<ToastState | null>(null)
let seq = 0

export function useToast(): UseToastReturn {
  return {
    toast,
    success: (message: string): void => {
      toast.value = { id: ++seq, message, kind: 'success' }
    },
    error: (message: string): void => {
      toast.value = { id: ++seq, message, kind: 'error' }
    },
    dismiss: (): void => {
      toast.value = null
    }
  }
}
