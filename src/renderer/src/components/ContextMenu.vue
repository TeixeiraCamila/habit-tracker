<script setup lang="ts">
import type { MenuItem } from '@renderer/types/menu'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{ open: boolean; x: number; y: number; items: MenuItem[] }>()
const emit = defineEmits<{ select: [key: string]; close: [] }>()

const menu = ref<HTMLElement | null>(null)
const pos = ref({ left: 0, top: 0 })

// abre no ponteiro e mantém menu na janela
watch(
  () => props.open,
  async (open) => {
    if (!open) return
    pos.value = { left: props.x, top: props.y }
    await nextTick()
    const el = menu.value
    if (!el) return
    pos.value = {
      left: Math.max(8, Math.min(props.x, window.innerWidth - el.offsetWidth - 8)),
      top: Math.max(8, Math.min(props.y, window.innerHeight - el.offsetHeight - 8))
    }
    el.querySelector('button')?.focus()
  }
)

function onKeyDown(event: KeyboardEvent): void {
  if (props.open && event.key === 'Escape') emit('close')
}

function onPointerDown(event: PointerEvent): void {
  if (props.open && !menu.value?.contains(event.target as Node)) emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('pointerdown', onPointerDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('pointerdown', onPointerDown)
})
</script>

<template>
  <div
    v-if="open"
    ref="menu"
    class="context-menu"
    role="menu"
    :style="{ left: `${pos.left}px`, top: `${pos.top}px` }"
  >
    <button
      v-for="item in items"
      :key="item.key"
      type="button"
      role="menuitem"
      class="context-menu__item"
      :class="{ 'is-danger': item.danger }"
      @click="emit('select', item.key)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<style scoped></style>
