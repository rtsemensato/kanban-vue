<script setup lang="ts">
import { useBoardStore } from '@/stores/board'
import BoardColumn from './components/BoardColumn.vue'

const board = useBoardStore()
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <p class="eyebrow">// projeto pessoal</p>
      <h1>Kanban</h1>
      <p class="app-subtitle">
        Board simples com drag-and-drop entre colunas. Tudo salvo no seu navegador, sem backend.
      </p>
    </header>

    <main class="board">
      <BoardColumn v-for="column in board.columns" :key="column.id" :column="column" />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}

.app-header {
  margin-bottom: 32px;
}

.eyebrow {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
  font-size: 0.8rem;
  color: var(--accent);
  margin: 0 0 10px;
}

.app-header h1 {
  margin: 0 0 8px;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.app-subtitle {
  margin: 0;
  color: var(--mute);
  max-width: 520px;
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 720px) {
  .board {
    grid-template-columns: 1fr;
  }
}
</style>
