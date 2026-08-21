<script setup lang="ts">
import { ref } from 'vue'
import { useBoardStore } from '@/stores/board'
import type { ColumnId } from '@/types'

const props = defineProps<{ columnId: ColumnId }>()

const board = useBoardStore()
const isOpen = ref(false)
const title = ref('')
const description = ref('')

function openForm() {
  isOpen.value = true
}

function closeForm() {
  isOpen.value = false
  title.value = ''
  description.value = ''
}

function submit() {
  if (!title.value.trim()) return
  board.addCard(props.columnId, title.value, description.value)
  closeForm()
}
</script>

<template>
  <form v-if="isOpen" class="add-card-form" @submit.prevent="submit">
    <input v-model="title" type="text" placeholder="Título do cartão" autofocus />
    <textarea v-model="description" placeholder="Descrição (opcional)" rows="2"></textarea>
    <div class="add-card-actions">
      <button type="submit" class="btn-primary">Adicionar</button>
      <button type="button" class="btn-ghost" @click="closeForm">Cancelar</button>
    </div>
  </form>
  <button v-else type="button" class="add-card-trigger" @click="openForm">+ Adicionar cartão</button>
</template>

<style scoped>
.add-card-trigger {
  width: 100%;
  background: transparent;
  border: 1px dashed var(--line);
  border-radius: var(--radius);
  color: var(--mute);
  padding: 10px;
  cursor: pointer;
  font-size: 0.85rem;
  text-align: left;
}

.add-card-trigger:hover {
  border-color: var(--accent);
  color: var(--ink);
}

.add-card-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 10px;
}

.add-card-form input,
.add-card-form textarea {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 0.85rem;
  resize: vertical;
}

.add-card-actions {
  display: flex;
  gap: 8px;
}

.btn-primary,
.btn-ghost {
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: var(--accent);
  color: #fff;
  border: 1px solid transparent;
}

.btn-ghost {
  background: transparent;
  color: var(--mute);
  border: 1px solid var(--line);
}

.btn-ghost:hover {
  color: var(--ink);
}
</style>
