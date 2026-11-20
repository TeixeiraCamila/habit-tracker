// Store das preferências locais; a Fase 7 expande a tela de configurações.
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@renderer/api'
import { DEFAULT_SETTINGS } from '@shared/defaults'
import type { Settings } from '@shared/types'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>({ ...DEFAULT_SETTINGS })

  async function load(): Promise<void> {
    settings.value = await api.settings.get()
  }

  async function set(patch: Partial<Settings>): Promise<void> {
    settings.value = await api.settings.set(patch)
  }

  return { settings, load, set }
})
