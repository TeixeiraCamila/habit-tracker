import type { GroupColor } from '@shared/types'

export interface GroupColorOption {
  key: GroupColor
  label: string
}

// Paleta de grupos: a chave vira o sufixo dos tokens --group-* no CSS.
export const GROUP_COLORS: GroupColorOption[] = [
  { key: 'orange', label: 'Laranja' },
  { key: 'yellow', label: 'Amarelo' },
  { key: 'green', label: 'Verde' },
  { key: 'red', label: 'Vermelho' },
  { key: 'blue', label: 'Azul' },
  { key: 'lilac', label: 'Lilás' },
  { key: 'pink', label: 'Rosa' }
]

export function groupColorStyle(color: GroupColor): Record<string, string> {
  return {
    '--group-color': `var(--group-${color})`,
    '--group-bg': `var(--group-${color}-bg)`
  }
}
