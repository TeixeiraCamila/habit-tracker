import { nextTick } from 'vue'
import type { ZodError } from 'zod'

export type FieldErrors = Record<string, string>

// um erro por campo: o primeiro que o Zod reportar
export function toFieldErrors(error: ZodError): FieldErrors {
  const errors: FieldErrors = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form')
    if (!(key in errors)) errors[key] = issue.message
  }
  return errors
}

// foca o primeiro campo com erro na ordem em que aparece na tela
export async function focusFirstError(
  root: HTMLElement | null,
  errors: FieldErrors
): Promise<void> {
  await nextTick()
  const fields = root?.querySelectorAll<HTMLElement>('[data-field]') ?? []
  const first = [...fields].find((el) => errors[el.dataset.field ?? ''])
  first?.querySelector<HTMLElement>('input, select, textarea, button')?.focus()
}
