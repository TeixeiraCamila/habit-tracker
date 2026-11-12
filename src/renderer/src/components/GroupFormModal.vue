<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Modal from './Modal.vue'
import TextField from './TextField.vue'
import ColorPicker from './ColorPicker.vue'
import IconPicker from './IconPicker.vue'
import GroupRow from './GroupRow.vue'
import { iconNames } from '@renderer/icons'
import { useGroupsStore } from '@renderer/stores/groups'
import { newGroupSchema } from '@shared/schemas'
import { errorMessage } from '@renderer/utils/errors'
import { focusFirstError, toFieldErrors, type FieldErrors } from '@renderer/utils/form'
import type { Group, GroupColor, NewGroup } from '@shared/types'

const props = defineProps<{
  open: boolean
  group: Group | null
}>()

const emit = defineEmits<{ close: [] }>()

const groups = useGroupsStore()

const name = ref('')
const color = ref<GroupColor>('orange')
const icon = ref(iconNames[0])
const errors = ref<FieldErrors>({})
const formError = ref('')
const touched = ref(false)
const saving = ref(false)
const formEl = ref<HTMLFormElement | null>(null)

const title = computed(() => (props.group ? 'Editar grupo' : 'Novo grupo'))

watch(
  () => props.open,
  (open) => {
    if (!open) return
    const g = props.group
    name.value = g?.name ?? ''
    color.value = g?.color ?? 'orange'
    icon.value = g?.icon ?? iconNames[0]
    errors.value = {}
    formError.value = ''
    touched.value = false
    saving.value = false
  }
)

function toPayload(): NewGroup {
  return {
    name: name.value.trim(),
    color: color.value,
    icon: icon.value
  }
}

function validate(): ReturnType<typeof newGroupSchema.safeParse> {
  const parsed = newGroupSchema.safeParse(toPayload())
  errors.value = parsed.success ? {} : toFieldErrors(parsed.error)
  return parsed
}

watch(
  () => name.value,
  () => {
    if (touched.value) validate()
  }
)

async function save(): Promise<void> {
  touched.value = true
  const parsed = validate()
  if (!parsed.success) {
    errors.value = toFieldErrors(parsed.error)
    await focusFirstError(formEl.value, errors.value)
    return
  }
  errors.value = {}
  formError.value = ''
  saving.value = true
  try {
    if (props.group) {
      await groups.update(props.group.id, parsed.data)
    } else {
      await groups.create(parsed.data)
    }
    emit('close')
  } catch (e) {
    formError.value = errorMessage(e)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Modal :open="open" :title="title" @close="emit('close')">
    <form id="group-form" ref="formEl" class="form" novalidate @submit.prevent="save">
      <div data-field="name">
        <TextField v-model="name" label="Nome" placeholder="Ex.: Manhã" :error="errors.name" />
      </div>

      <ColorPicker v-model="color" />

      <IconPicker v-model="icon" :icons="iconNames" />

      <div data-field="preview">
        <GroupRow :name="name" :color="color" :icon="icon" :expanded="false" />
      </div>

      <p v-if="formError" class="field-error" role="alert">{{ formError }}</p>
    </form>

    <template #footer>
      <button type="button" class="btn" @click="emit('close')">Cancelar</button>
      <button type="submit" form="group-form" class="btn btn-primary" :disabled="saving">
        Salvar
      </button>
    </template>
  </Modal>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>
