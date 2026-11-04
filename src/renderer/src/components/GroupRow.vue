<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { getIcon } from '@renderer/icons'
import type { GroupColor } from '@shared/types'

const props = defineProps<{
  name: string
  color: GroupColor
  icon: string
  expanded: boolean
}>()

defineEmits<{
  toggle: []
  'context-menu': [event: MouseEvent]
}>()

const Icon = computed(() => getIcon(props.icon))
const style = computed(() => ({
  '--fg': `var(--group-${props.color})`,
  '--row-bg': `var(--group-${props.color}-bg)`
}))
</script>

<template>
  <button
    class="group-row"
    :style="style"
    :aria-expanded="expanded"
    @click="$emit('toggle')"
    @contextmenu.prevent="$emit('context-menu', $event)"
  >
    <ChevronRight class="chevron" :class="{ open: expanded }" :size="16" :stroke-width="1.75" />
    <component :is="Icon" :size="20" :stroke-width="1.75" />
    <span>{{ name }}</span>
  </button>
</template>

<style scoped>
.group-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  height: var(--row-height);
  padding: 0 var(--space-4);
  border-radius: var(--radius-md);
  background: var(--row-bg);
  color: var(--fg);
  text-align: left;
}

.chevron {
  transition: transform var(--motion-base) var(--ease-out);
}

.chevron.open {
  transform: rotate(90deg);
}
</style>
