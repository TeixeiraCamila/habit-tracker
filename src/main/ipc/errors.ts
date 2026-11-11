// Converte erros do banco e do Zod em mensagens legíveis e serializáveis.
import { ZodError } from 'zod'

const SQLITE_MESSAGES: Record<string, string> = {
  SQLITE_CONSTRAINT_FOREIGNKEY: 'O registro relacionado não existe mais.',
  SQLITE_CONSTRAINT_UNIQUE: 'Esse registro já existe.',
  SQLITE_CONSTRAINT_NOTNULL: 'Há um campo obrigatório vazio.',
  SQLITE_CONSTRAINT_CHECK: 'Um dos valores é inválido.'
}

export function toMessage(err: unknown): string {
  if (err instanceof ZodError) return err.issues[0]?.message ?? 'Dados inválidos.'
  const code = (err as { code?: unknown } | null)?.code
  if (typeof code === 'string' && SQLITE_MESSAGES[code]) return SQLITE_MESSAGES[code]
  return 'Erro inesperado. Tente de novo.'
}
