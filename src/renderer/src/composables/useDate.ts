// Datas locais da interface, derivadas das preferências de virada e início da semana.
import { computed, type ComputedRef } from 'vue'
import { useSettingsStore } from '@renderer/stores/settings'
import { addDaysToKey, formatDay, formatFullDate, startOfWeekKey, todayKey } from '@shared/date'

export interface UseDateReturn {
  today: ComputedRef<string>
  weekStartsOn: ComputedRef<0 | 1>
  isFuture: (key: string) => boolean
  addDays: (key: string, days: number) => string
  startOfWeek: (key: string) => string
  formatDay: (key: string) => string
  formatFullDate: (key: string) => string
}

export function useDate(): UseDateReturn {
  const settingsStore = useSettingsStore()

  const today = computed(() => todayKey(new Date(), settingsStore.settings.dayStartsAt))
  const weekStartsOn = computed<0 | 1>(() => settingsStore.settings.weekStartsOn)

  return {
    today,
    weekStartsOn,
    isFuture: (key) => key > today.value,
    addDays: addDaysToKey,
    startOfWeek: (key) => startOfWeekKey(key, weekStartsOn.value),
    formatDay,
    formatFullDate
  }
}
