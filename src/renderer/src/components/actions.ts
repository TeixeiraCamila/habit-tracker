export type ActionKey =
  'new-habit' | 'new-group' | 'sort' | 'toggle-view' | 'collapse-all' | 'edit-habit'

export interface ActionItem {
  key: ActionKey
  icon: string
  label: string
}

export const ACTION_ITEMS: ActionItem[] = [
  { key: 'new-habit', icon: 'plus', label: 'Novo hábito' },
  { key: 'new-group', icon: 'folder-plus', label: 'Novo grupo' },
  { key: 'sort', icon: 'arrow-up-down', label: 'Ordenar' },
  { key: 'toggle-view', icon: 'repeat', label: 'Alternar visão' },
  { key: 'collapse-all', icon: 'chevrons-up', label: 'Recolher tudo' }
]
