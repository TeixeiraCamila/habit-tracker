// Schemas Zod para validar payloads IPC antes de chegar ao banco.
import { z } from 'zod'

export const idSchema = z.number().int().positive()

export const dateKeySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe uma data válida')
  .superRefine((value, ctx) => {
    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      ctx.addIssue({ code: 'custom', path: ['date'], message: 'Informe uma data válida' })
    }
  })
export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Horário inválido')

const name = z
  .string({ error: 'Informe um nome' })
  .trim()
  .min(1, 'Informe um nome')
  .max(60, 'Uso no máximo de 60 caracteres')
const icon = z.string().min(1, 'Escolha um ícone').max(40)

export const newGroupSchema = z.object({
  name: name,
  color: z.enum(['orange', 'yellow', 'green', 'red', 'blue', 'lilac', 'pink'], {
    error: 'Escolha uma cor'
  }),
  icon: icon
})

export const groupPatchSchema = newGroupSchema.partial()

// hábitos
const habitBase = z.object({
  groupId: idSchema.nullable(),
  name: name,
  description: z.string().max(500, 'Use no máximo 500 caracteres').optional(),
  icon,
  kind: z.enum(['boolean', 'counter'], { error: 'Escolha um tipo de hábito' }),
  target: z
    .number({ error: 'Informe a meta' })
    .int('A meta deve ser um número inteiro')
    .min(1, 'A meta mínima deve ser 1')
    .max(1000, 'A meta máxima deve ser 1000')
    .positive(),
  unit: z.string().max(20, 'Use no máximo 20 caracteres').optional(),
  freqType: z.enum(['daily', 'weekdays', 'times_per_week'], {
    error: 'Escolha uma frequência'
  }),
  freqDays: z
    .array(z.number().int().min(0).max(6))
    .min(1, 'Escolha ao menos um dia')
    .max(7)
    .optional()
    .optional(),
  freqTimes: z
    .number({ error: 'Informe quantas vezes por semana' })
    .int()
    .min(1, 'Informe de 1 a 7 vezes')
    .max(7, 'Informe de 1 a 7 vezes')
    .optional(),
  reminderTime: timeSchema.optional(),
  startDate: dateKeySchema
})

export const newHabitSchema = habitBase.superRefine((h, ctx) => {
  if (h.freqType === 'weekdays' && !h.freqDays) {
    ctx.addIssue({
      code: 'custom',
      path: ['freqDays'],
      message: 'Escolha ao menos um dia'
    })
  }
  if (h.freqType === 'times_per_week' && !h.freqTimes) {
    ctx.addIssue({
      code: 'custom',
      path: ['freqTimes'],
      message: 'Informe quantas vezes por semana'
    })
  }
})

export const habitPatchSchema = habitBase.partial()

// check-ins
export const setCompletionSchema = z.object({
  habitId: idSchema,
  date: dateKeySchema,
  value: z.number().int().min(0).max(1000).positive(),
  note: z.string().max(500).optional()
})

// configurações
export const settingsPatchSchema = z
  .object({
    dayStartsAt: timeSchema,
    weekStartsOn: z.union([z.literal(0), z.literal(1)]),
    notifications: z.boolean(),
    launchAtLogin: z.boolean(),
    minimizeToTray: z.boolean(),
    autoBackup: z.boolean()
  })
  .partial()
  .strict()
