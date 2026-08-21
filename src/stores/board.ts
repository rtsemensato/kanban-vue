import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import type { ColumnId, KanbanCard, KanbanColumn } from '@/types'

const STORAGE_KEY = 'kanban-vue-board'

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function defaultColumns(): KanbanColumn[] {
  return [
    { id: 'todo', title: 'A fazer', cards: [] },
    { id: 'doing', title: 'Fazendo', cards: [] },
    { id: 'done', title: 'Feito', cards: [] },
  ]
}

function isKanbanColumnArray(value: unknown): value is KanbanColumn[] {
  return (
    Array.isArray(value) &&
    value.every(
      (column) =>
        column &&
        typeof column === 'object' &&
        typeof (column as KanbanColumn).id === 'string' &&
        Array.isArray((column as KanbanColumn).cards),
    )
  )
}

function loadColumns(): KanbanColumn[] {
  if (typeof window === 'undefined') return defaultColumns()
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaultColumns()
    const parsed = JSON.parse(saved) as unknown
    if (isKanbanColumnArray(parsed)) return parsed
  } catch {
    // storage corrompido ou indisponível, cai no padrão abaixo
  }
  return defaultColumns()
}

export const useBoardStore = defineStore('board', () => {
  const columns = reactive<KanbanColumn[]>(loadColumns())

  watch(
    columns,
    (value) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch {
        // ignora se o storage estiver indisponível (modo privado, etc.)
      }
    },
    { deep: true },
  )

  function addCard(columnId: ColumnId, title: string, description: string) {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    const column = columns.find((c) => c.id === columnId)
    if (!column) return

    const card: KanbanCard = {
      id: createId(),
      title: trimmedTitle,
      description: description.trim(),
      createdAt: Date.now(),
    }
    column.cards.push(card)
  }

  function deleteCard(columnId: ColumnId, cardId: string) {
    const column = columns.find((c) => c.id === columnId)
    if (!column) return
    column.cards = column.cards.filter((c) => c.id !== cardId)
  }

  function moveCard(cardId: string, fromColumnId: ColumnId, toColumnId: ColumnId, toIndex: number) {
    const fromColumn = columns.find((c) => c.id === fromColumnId)
    const toColumn = columns.find((c) => c.id === toColumnId)
    if (!fromColumn || !toColumn) return

    const cardIndex = fromColumn.cards.findIndex((c) => c.id === cardId)
    if (cardIndex === -1) return

    const [card] = fromColumn.cards.splice(cardIndex, 1)
    if (!card) return

    const clampedIndex = Math.max(0, Math.min(toIndex, toColumn.cards.length))
    toColumn.cards.splice(clampedIndex, 0, card)
  }

  return { columns, addCard, deleteCard, moveCard }
})
