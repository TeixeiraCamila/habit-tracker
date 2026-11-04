import type { TreeGroup } from '@renderer/types/tree'

export const mockTree: TreeGroup[] = [
  {
    id: 1,
    name: 'Health',
    color: 'green',
    icon: 'Heart',
    habits: [
      { id: 1, name: 'Drink Water', icon: 'Droplets' },
      { id: 2, name: 'Exercise', icon: 'Dumbbell' }
    ]
  },
  {
    id: 2,
    name: 'Learning',
    color: 'blue',
    icon: 'BookOpen',
    habits: [
      { id: 3, name: 'Read a Book', icon: 'BookMarked' },
      { id: 4, name: 'Learn a Language', icon: 'Languages' }
    ]
  },
  {
    id: 3,
    name: 'Mindfulness',
    color: 'lilac',
    icon: 'Brain',
    habits: [
      { id: 5, name: 'Meditate', icon: 'Sunrise' },
      { id: 6, name: 'Journal', icon: 'NotebookPen' }
    ]
  },
  {
    id: 4,
    name: 'Fitness',
    color: 'orange',
    icon: 'Footprints',
    habits: [
      { id: 7, name: 'Run', icon: 'Activity' },
      { id: 8, name: 'Yoga', icon: 'Circle' }
    ]
  }
]
