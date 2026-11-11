// Seed de desenvolvimento: popula grupos, hábitos e check-ins recentes no banco.
import type { Db } from './connection'
import { groupsRepo } from '../repositories/groups'
import { habitsRepo } from '../repositories/habits'
import { completionsRepo } from '../repositories/completions'
import { addDays, toDateKey } from '@shared/date'
import type { GroupColor, NewHabit } from '@shared/types'

const DAYS = 90

// Gerador com semeia: o seed gera sempre os mesmos dados.
function rng(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type SeedHabit = Omit<NewHabit, 'groupId' | 'startDate'> & { rate: number }

const daily = (name: string, icon: string, rate: number): SeedHabit => ({
  name,
  icon,
  rate,
  kind: 'boolean',
  target: 1,
  freqType: 'daily'
})

const data: {
  group: { name: string; color: GroupColor; icon: string } | null
  habits: SeedHabit[]
}[] = [
  {
    group: { name: 'Manhã', color: 'orange', icon: 'Sunrise' },
    habits: [
      {
        name: 'Beber água',
        icon: 'Droplets',
        rate: 0.8,
        kind: 'counter',
        target: 8,
        unit: 'copos',
        freqType: 'daily'
      },
      daily('Alongar', 'Activity', 0.6)
    ]
  },
  {
    group: { name: 'Estudo', color: 'yellow', icon: 'BookMarked' },
    habits: [
      {
        name: 'Inglês',
        icon: 'Languages',
        rate: 0.7,
        kind: 'boolean',
        target: 1,
        freqType: 'weekdays',
        freqDays: [1, 2, 3, 4, 5]
      },
      daily('Ler 20 páginas', 'BookOpen', 0.55)
    ]
  },
  {
    group: { name: 'Corpo', color: 'green', icon: 'Dumbbell' },
    habits: [
      {
        name: 'Treinar',
        icon: 'Dumbbell',
        rate: 0.5,
        kind: 'boolean',
        target: 1,
        freqType: 'times_per_week',
        freqTimes: 4
      },
      daily('Caminhar', 'Footprints', 0.5)
    ]
  },
  {
    group: { name: 'Mente', color: 'red', icon: 'Heart' },
    habits: [daily('Meditar', 'Brain', 0.65), daily('Diário', 'NotebookPen', 0.4)]
  },
  { group: null, habits: [daily('Tomar vitaminas', 'Circle', 0.9)] }
]

// Devolve false (sem mexer em nada) se o banco já tem grupos.
export function seedDev(db: Db): boolean {
  const groups = groupsRepo(db)
  if (groups.list().length > 0) return false

  const habits = habitsRepo(db)
  const completions = completionsRepo(db)
  const random = rng(42)
  const today = new Date()
  const startDate = toDateKey(addDays(today, -DAYS))

  db.transaction(() => {
    for (const entry of data) {
      const groupId = entry.group ? groups.create(entry.group).id : null

      for (const { rate, ...h } of entry.habits) {
        const habit = habits.create({ ...h, groupId, startDate })

        // até ontem: o dia de hoje fica em aberto para testar o check-in
        for (let i = DAYS; i >= 1; i--) {
          const day = addDays(today, -i)
          const isDue = habit.freqType !== 'weekdays' || habit.freqDays!.includes(day.getDay())
          if (!isDue || random() > rate) continue

          const value = habit.kind === 'counter' ? Math.ceil(random() * (habit.target + 1)) : 1
          completions.set(habit.id, toDateKey(day), value)
        }
      }
    }
  })()

  return true
}
