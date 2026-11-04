<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '@renderer/icons'

const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 18 })

const Icon = computed(() => getIcon(props.name))
</script>

<template>
  <component :is="Icon" :size="props.size" :stroke-width="1.5" aria-hidden="true" />
</template>
