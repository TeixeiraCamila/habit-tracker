<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'
import IconButton from './IconButton.vue'

const props = defineProps<{
  title: string
  habitCount: number
  groupCount: number
}>()

const emit = defineEmits<{ 'open-settings': [] }>()

const subtitle = computed(() => {
  const habits = `${props.habitCount} ${props.habitCount === 1 ? 'hábito' : 'hábitos'}`
  const groups = `${props.groupCount} ${props.groupCount === 1 ? 'grupo' : 'grupos'}`
  return `${habits}, ${groups}`
})
</script>

<template>
  <header class="app-header">
    <div class="app-header__heading">
      <h1 class="app-header__title">
        {{ title }}
        <AppIcon name="chevron-down" :size="18" class="app-header__chevron" />
      </h1>
      <p class="app-header__subtitle">{{ subtitle }}</p>
    </div>

    <IconButton icon="settings" label="Configurações" @click="emit('open-settings')" />
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-6) var(--space-4);
}

.app-header__heading {
  min-width: 0;
}

.app-header__title {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  font-size: var(--text-xl);
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-title);
}

.app-header__chevron {
  color: var(--text-muted);
}

.app-header__subtitle {
  margin-top: var(--space-1);
  font-size: var(--text-sm);
  color: var(--text-muted);
}
</style>
