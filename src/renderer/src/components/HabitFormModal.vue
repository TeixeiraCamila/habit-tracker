<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import Modal from './Modal.vue'
import TextField from './TextField.vue'
import IconPicker from './IconPicker.vue'
import { iconNames } from '@renderer/icons'
import { useGroupsStore } from '@renderer/stores/groups'
import { useHabitsStore } from '@renderer/stores/habits'
import { newHabitSchema } from '@shared/schemas'
import { toDateKey } from '@shared/date'
import { errorMessage } from '@renderer/utils/errors'
import { focusFirstError, toFieldErrors, type FieldErrors } from '@renderer/utils/form'
import type { FreqType, Habit, HabitKind, NewHabit } from '@shared/types'

const props = defineProps<{ open: boolean; habit: Habit | null }>()
const emit = defineEmits<{ close: [] }>()

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const groups = useGroupsStore()
const habits = useHabitsStore()

interface Form {
  name: string
  description: string
  groupId: number | null
  icon: string
  kind: HabitKind
  target: number | ''
  unit: string
  freqType: FreqType
  freqDays: number[]
  freqTimes: number | ''
  reminderTime: string
  startDate: string
}

const emptyForm = (): Form => ({
  name: '',
  description: '',
  groupId: null,
  icon: iconNames[0],
  kind: 'boolean',
  target: 1,
  unit: '',
  freqType: 'daily',
  freqDays: [1, 2, 3, 4, 5],
  freqTimes: 3,
  reminderTime: '',
  startDate: toDateKey(new Date())
})

const form = reactive<Form>(emptyForm())
const errors = ref<FieldErrors>({})
const formError = ref('')
const touched = ref(false)
const saving = ref(false)
const formEl = ref<HTMLFormElement | null>(null)

const title = computed(() => (props.habit ? 'Editar hábito' : 'Novo hábito'))

watch(
  () => props.open,
  (open) => {
    if (!open) return
    const h = props.habit
    Object.assign(
      form,
      emptyForm(),
      h && {
        name: h.name,
        description: h.description ?? '',
        groupId: h.groupId,
        icon: h.icon,
        kind: h.kind,
        target: h.target,
        unit: h.unit ?? '',
        freqType: h.freqType,
        freqDays: h.freqDays ?? [1, 2, 3, 4, 5],
        freqTimes: h.freqTimes ?? 3,
        reminderTime: h.reminderTime ?? '',
        startDate: h.startDate
      }
    )
    errors.value = {}
    formError.value = ''
    touched.value = false
  }
)

// o que o formulário guarda -> o que o schema espera
function toPayload(): NewHabit {
  const counter = form.kind === 'counter'
  return {
    groupId: form.groupId,
    name: form.name,
    description: form.description.trim() || undefined,
    icon: form.icon,
    kind: form.kind,
    target: counter ? Number(form.target) : 1,
    unit: counter ? form.unit.trim() || undefined : undefined,
    freqType: form.freqType,
    freqDays: form.freqType === 'weekdays' ? form.freqDays : undefined,
    freqTimes: form.freqType === 'times_per_week' ? Number(form.freqTimes) : undefined,
    reminderTime: form.reminderTime || undefined,
    startDate: form.startDate
  }
}

function validate(): ReturnType<typeof newHabitSchema.safeParse> {
  const parsed = newHabitSchema.safeParse(toPayload())
  errors.value = parsed.success ? {} : toFieldErrors(parsed.error)
  return parsed
}

// depois da primeira tentativa, os erros somem conforme a pessoa corrige
watch(form, () => touched.value && validate(), { deep: true })

function toggleDay(day: number): void {
  const i = form.freqDays.indexOf(day)
  if (i >= 0) form.freqDays.splice(i, 1)
  else form.freqDays.push(day)
}

async function save(): Promise<void> {
  touched.value = true
  const parsed = validate()
  if (!parsed.success) {
    await focusFirstError(formEl.value, errors.value)
    return
  }

  formError.value = ''
  saving.value = true
  try {
    if (props.habit) await habits.update(props.habit.id, parsed.data)
    else await habits.create(parsed.data)
    emit('close')
  } catch (e) {
    formError.value = errorMessage(e)
  } finally {
    saving.value = false
  }
}

const deleting = ref(false)

async function deleteHabit(): Promise<void> {
  const habit = props.habit
  if (!habit) return
  if (!window.confirm(`Excluir o hábito "${habit.name}"? Essa ação não pode ser desfeita.`)) return
  deleting.value = true
  try {
    await habits.remove(habit.id)
    emit('close')
  } catch (e) {
    formError.value = errorMessage(e)
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <Modal :open="open" :title="title" @close="emit('close')">
    <form id="habit-form" ref="formEl" class="form" novalidate @submit.prevent="save">
      <div data-field="name">
        <TextField
          v-model="form.name"
          label="Nome"
          placeholder="Ex.: Beber água"
          :error="errors.name"
        />
      </div>

      <div class="field" data-field="description">
        <label class="field-label" for="habit-description">Descrição (opcional)</label>
        <textarea
          id="habit-description"
          v-model="form.description"
          class="input textarea"
          rows="2"
          :aria-invalid="!!errors.description"
        />
        <p v-if="errors.description" class="field-error" role="alert">{{ errors.description }}</p>
      </div>

      <div class="field" data-field="groupId">
        <label class="field-label" for="habit-group">Grupo</label>
        <select id="habit-group" v-model="form.groupId" class="input">
          <option :value="null">Sem grupo</option>
          <option v-for="g in groups.items" :key="g.id" :value="g.id">{{ g.name }}</option>
        </select>
      </div>

      <div data-field="icon">
        <IconPicker v-model="form.icon" :icons="iconNames" />
      </div>

      <fieldset class="field" data-field="kind">
        <legend class="field-label">Tipo</legend>
        <div class="choices">
          <label class="choice">
            <input v-model="form.kind" type="radio" value="boolean" /> Feito / não feito
          </label>
          <label class="choice">
            <input v-model="form.kind" type="radio" value="counter" /> Contador
          </label>
        </div>
      </fieldset>

      <div v-if="form.kind === 'counter'" class="row">
        <div class="field" data-field="target">
          <label class="field-label" for="habit-target">Meta por dia</label>
          <input
            id="habit-target"
            v-model.number="form.target"
            class="input"
            type="number"
            min="1"
            :aria-invalid="!!errors.target"
          />
          <p v-if="errors.target" class="field-error" role="alert">{{ errors.target }}</p>
        </div>
        <div class="field" data-field="unit">
          <label class="field-label" for="habit-unit">Unidade</label>
          <input
            id="habit-unit"
            v-model="form.unit"
            class="input"
            placeholder="copos, páginas..."
            :aria-invalid="!!errors.unit"
          />
          <p v-if="errors.unit" class="field-error" role="alert">{{ errors.unit }}</p>
        </div>
      </div>

      <fieldset class="field" data-field="freqType">
        <legend class="field-label">Frequência</legend>
        <div class="choices">
          <label class="choice">
            <input v-model="form.freqType" type="radio" value="daily" /> Todo dia
          </label>
          <label class="choice">
            <input v-model="form.freqType" type="radio" value="weekdays" /> Dias da semana
          </label>
          <label class="choice">
            <input v-model="form.freqType" type="radio" value="times_per_week" /> X vezes por semana
          </label>
        </div>
      </fieldset>

      <div v-if="form.freqType === 'weekdays'" class="field" data-field="freqDays">
        <div class="days">
          <button
            v-for="(label, day) in DAYS"
            :key="day"
            type="button"
            class="day"
            :class="{ on: form.freqDays.includes(day) }"
            :aria-pressed="form.freqDays.includes(day)"
            @click="toggleDay(day)"
          >
            {{ label }}
          </button>
        </div>
        <p v-if="errors.freqDays" class="field-error" role="alert">{{ errors.freqDays }}</p>
      </div>

      <div v-if="form.freqType === 'times_per_week'" class="field" data-field="freqTimes">
        <label class="field-label" for="habit-times">Vezes por semana</label>
        <input
          id="habit-times"
          v-model.number="form.freqTimes"
          class="input"
          type="number"
          min="1"
          max="7"
          :aria-invalid="!!errors.freqTimes"
        />
        <p v-if="errors.freqTimes" class="field-error" role="alert">{{ errors.freqTimes }}</p>
      </div>

      <div class="row">
        <div class="field" data-field="startDate">
          <label class="field-label" for="habit-start">Data de início</label>
          <input
            id="habit-start"
            v-model="form.startDate"
            class="input"
            type="date"
            :aria-invalid="!!errors.startDate"
          />
          <p v-if="errors.startDate" class="field-error" role="alert">{{ errors.startDate }}</p>
        </div>
        <div class="field" data-field="reminderTime">
          <label class="field-label" for="habit-reminder">Lembrete (opcional)</label>
          <input
            id="habit-reminder"
            v-model="form.reminderTime"
            class="input"
            type="time"
            :aria-invalid="!!errors.reminderTime"
          />
          <p v-if="errors.reminderTime" class="field-error" role="alert">
            {{ errors.reminderTime }}
          </p>
        </div>
      </div>

      <p v-if="formError" class="field-error" role="alert">{{ formError }}</p>
    </form>

    <template #footer>
      <button
        v-if="props.habit"
        type="button"
        class="btn btn-danger"
        :disabled="deleting"
        @click="deleteHabit"
      >
        Excluir hábito
      </button>
      <div>
        <button type="button" class="btn" @click="emit('close')">Cancelar</button>
        <button type="submit" form="habit-form" class="btn btn-primary" :disabled="saving">
          Salvar
        </button>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.textarea {
  height: auto;
  padding: var(--space-2) var(--space-3);
  resize: none;
}

.btn-danger {
  font-weight: 700;
}
footer div {
  display: flex;
  gap: var(--space-2);
}
footer button {
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  min-height: var(--row-height);
  padding: 0 var(--space-4);
}
footer button:hover {
  background: var(--surface);
  border-color: var(--surface-border);
  box-shadow: var(--shadow);
}
</style>
