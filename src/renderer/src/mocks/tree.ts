import type { TreeGroup } from '@renderer/types/tree'

export const mockTree: TreeGroup[] = [
  {
    id: 1,
    name: 'Health',
    color: 'green',
    icon: 'heart',
    habits: [
      { id: 1, name: 'Drink Water', icon: 'droplets' },
      { id: 2, name: 'Exercise', icon: 'dumbbell' }
    ]
  },
  {
    id: 2,
    name: 'Learning',
    color: 'blue',
    icon: 'book-open',
    habits: [
      { id: 3, name: 'Read a Book', icon: 'book-marked' },
      { id: 4, name: 'Learn a Language', icon: 'languages' }
    ]
  },
  {
    id: 3,
    name: 'Mindfulness',
    color: 'lilac',
    icon: 'brain',
    habits: [
      { id: 5, name: 'Meditate', icon: 'sunrise' },
      { id: 6, name: 'Journal', icon: 'notebook-pen' }
    ]
  },
  {
    id: 4,
    name: 'Fitness',
    color: 'orange',
    icon: 'footprints',
    habits: [
      { id: 7, name: 'Run', icon: 'activity' },
      { id: 8, name: 'Yoga', icon: 'circle' }
    ]
  }
]
