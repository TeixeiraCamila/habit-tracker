import { describe, expect, it } from 'vitest'
import { openDb } from '../db/connection'
import { migrate } from '../db/migrate'
import { completionsRepo } from '../repositories/completions'
import { newGroupSchema } from '@shared/schemas'
import { toMessage } from './errors'

describe('toMessage', () => {
  it('usa a mensagem do Zod', () => {
    const r = newGroupSchema.safeParse({ name: ' ', color: 'orange', icon: 'x' })
    expect(r.success).toBe(false)
    if (!r.success) expect(toMessage(r.error)).toBe('Informe um nome')
  })

  it('traduz erro de chave estrangeira do SQLite', () => {
    const db = openDb(':memory:')
    migrate(db)
    let caught: unknown
    try {
      completionsRepo(db).set(999, '2026-11-10', 1)
    } catch (e) {
      caught = e
    }
    expect(toMessage(caught)).toBe('O registro relacionado não existe mais.')
  })

  it('usa mensagem genérica para o resto', () => {
    expect(toMessage(new Error('boom'))).toBe('Erro inesperado. Tente de novo.')
  })
})
