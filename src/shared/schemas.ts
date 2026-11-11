// Schemas Zod para validar payloads IPC antes de chegar ao banco.
import { z } from 'zod'

export const idSchema = z.number().int().positive()

export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Horário inválido')

export const dateKeySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
  .superRefine((value, ctx) => {
    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      ctx.addIssue({ code: 'custom', path: ['date'], message: 'Data inválida' })
    }
  })

export const newGroupSchema = z.object({
  name: z.string().trim().min(1, 'Informe um nome'),
  color: z.enum(['orange', 'yellow', 'green', 'red', 'blue', 'lilac', 'pink']),
  icon: z.string().min(1, 'Informe um ícone')
})

export const groupPatchSchema = newGroupSchema.partial()

export const newHabitSchema = z.object({
  groupId: z.number().int().positive().nullable(),
  name: z.string().trim().min(1, 'Informe um nome'),
  description: z.string().optional(),
  icon: z.string().min(1, 'Informe um ícone'),
  kind: z.enum(['boolean', 'counter']),
  target: z.number().int().positive(),
  unit: z.string().optional(),
  freqType: z.enum(['daily', 'weekdays', 'times_per_week']),
  freqDays: z.array(z.number().int()).optional(),
  freqTimes: z.number().int().optional(),
  reminderTime: timeSchema.optional(),
  startDate: dateKeySchema
})

export const habitPatchSchema = newHabitSchema.omit({ startDate: true }).partial().extend({
  groupId: z.number().int().positive().nullable().optional()
})

export const setCompletionSchema = z.object({
  habitId: idSchema,
  date: dateKeySchema,
  value: z.number().int().positive(),
  note: z.string().optional()
})

export const settingsPatchSchema = z
  .object({
    dayStartsAt: timeSchema.optional(),
    weekStartsOn: z.union([z.literal(0), z.literal(1)]).optional(),
    notifications: z.boolean().optional(),
    launchAtLogin: z.boolean().optional(),
    minimizeToTray: z.boolean().optional(),
    autoBackup: z.boolean().optional()
  })
  .partial()
