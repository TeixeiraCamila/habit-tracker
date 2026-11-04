import {
  Activity,
  BookMarked,
  BookOpen,
  Brain,
  Circle,
  Droplets,
  Dumbbell,
  Footprints,
  Heart,
  Languages,
  NotebookPen,
  Sunrise,
  Sun,
  Leaf,
  type LucideIcon
} from 'lucide-vue-next'

const icons: Record<string, LucideIcon> = {
  Activity,
  BookMarked,
  BookOpen,
  Brain,
  Circle,
  Droplets,
  Dumbbell,
  Footprints,
  Heart,
  Languages,
  NotebookPen,
  Sunrise,
  Sun,
  Leaf
}

export const getIcon = (name: string): LucideIcon => icons[name] ?? Circle
