export type ColumnId = 'todo' | 'doing' | 'done'

export interface KanbanCard {
  id: string
  title: string
  description: string
  createdAt: number
}

export interface KanbanColumn {
  id: ColumnId
  title: string
  cards: KanbanCard[]
}
