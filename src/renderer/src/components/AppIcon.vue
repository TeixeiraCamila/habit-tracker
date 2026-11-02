<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'
import {
  AlertCircle,
  ArrowUpDown,
  BarChart3,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  ChevronsUp,
  Circle,
  Coffee,
  Droplets,
  Dumbbell,
  Folder,
  FolderPlus,
  Heart,
  Layers,
  LayoutList,
  Leaf,
  List,
  Moon,
  Music,
  Pencil,
  Plus,
  Repeat2,
  RotateCcw,
  Settings,
  Star,
  Sun,
  X
} from 'lucide-vue-next'

// Mapa de nomes estáveis para os ícones lucide usados na interface.
const icons: Record<string, Component> = {
  'alert-circle': AlertCircle,
  'arrow-up-down': ArrowUpDown,
  'bar-chart': BarChart3,
  'book-open': BookOpen,
  calendar: Calendar,
  check: Check,
  'chevron-down': ChevronDown,
  'chevrons-up': ChevronsUp,
  circle: Circle,
  coffee: Coffee,
  droplets: Droplets,
  dumbbell: Dumbbell,
  folder: Folder,
  'folder-plus': FolderPlus,
  heart: Heart,
  layers: Layers,
  'layout-list': LayoutList,
  leaf: Leaf,
  list: List,
  moon: Moon,
  music: Music,
  pencil: Pencil,
  plus: Plus,
  repeat: Repeat2,
  'rotate-ccw': RotateCcw,
  settings: Settings,
  star: Star,
  sun: Sun,
  x: X
}

const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 18 })

const icon = computed(() => icons[props.name] ?? Circle)
</script>

<template>
  <component :is="icon" :size="size" :stroke-width="1.5" aria-hidden="true" />
</template>
