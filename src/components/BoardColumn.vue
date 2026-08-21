<script setup lang="ts">
import { ref } from 'vue'
import type { KanbanColumn } from '@/types'
import { useBoardStore } from '@/stores/board'
import BoardCard from './BoardCard.vue'
import AddCardForm from './AddCardForm.vue'

const props = defineProps<{ column: KanbanColumn }>()

const board = useBoardStore()
const isDragOver = ref(false)
const cardRefs = ref<(HTMLElement | null)[]>([])

function setCardRef(el: Element | null, index: number) {
  cardRefs.value[index] = el instanceof HTMLElement ? el : null
}

function onDragStart(event: DragEvent, cardId: string) {
  if (!event.dataTransfer) return
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('application/json', JSON.stringify({ cardId, fromColumnId: props.column.id }))
}

/** Descobre em qual posição da coluna o cartão deve entrar, com base na altura do mouse. */
function dropIndexFromEvent(event: DragEvent): number {
  for (let i = 0; i < cardRefs.value.length; i++) {
    const el = cardRefs.value[i]
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (event.clientY < rect.top + rect.height / 2) {
      return i
    }
  }
  return props.column.cards.length
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
  isDragOver.value = true
}

function onDragLeave() {
  isDragOver.value = false
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  isDragOver.value = false

  const raw = event.dataTransfer?.getData('application/json')
  if (!raw) return

  const { cardId, fromColumnId } = JSON.parse(raw) as { cardId: string; fromColumnId: KanbanColumn['id'] }
  const toIndex = dropIndexFromEvent(event)
  board.moveCard(cardId, fromColumnId, props.column.id, toIndex)
}
</script>

<template>
  <section class="column" :class="{ 'is-drag-over': isDragOver }" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
    <header class="column-head">
      <h2>{{ column.title }}</h2>
      <span class="count">{{ column.cards.length }}</span>
    </header>

    <div class="card-list">
      <p v-if="!column.cards.length" class="empty-hint">Nenhum cartão ainda</p>
      <div
        v-for="(card, index) in column.cards"
        :key="card.id"
        :ref="(el) => setCardRef(el as Element | null, index)"
        class="card-wrapper"
        draggable="true"
        @dragstart="onDragStart($event, card.id)"
      >
        <BoardCard :card="card" @delete="board.deleteCard(column.id, card.id)" />
      </div>
    </div>

    <AddCardForm :column-id="column.id" />
  </section>
</template>

<style scoped>
.column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 14px;
  min-height: 220px;
  transition: border-color 0.15s ease;
}

.column.is-drag-over {
  border-color: var(--accent);
}

.column-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.column-head h2 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
}

.count {
  font-size: 0.78rem;
  color: var(--mute);
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 1px 8px;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 40px;
}

.card-wrapper {
  cursor: grab;
}

.card-wrapper:active {
  cursor: grabbing;
}

.empty-hint {
  margin: 0;
  font-size: 0.8rem;
  color: var(--mute);
  padding: 8px 2px;
}
</style>
