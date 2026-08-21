<script setup lang="ts">
import type { KanbanCard } from '@/types'

defineProps<{ card: KanbanCard }>()
defineEmits<{ delete: [] }>()
</script>

<template>
  <article class="card">
    <div class="card-body">
      <p class="card-title">{{ card.title }}</p>
      <p v-if="card.description" class="card-desc">{{ card.description }}</p>
    </div>
    <button class="card-delete" type="button" aria-label="Excluir cartão" @click="$emit('delete')">
      ×
    </button>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 12px 14px;
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-title {
  margin: 0;
  font-weight: 600;
  font-size: 0.92rem;
  word-break: break-word;
}

.card-desc {
  margin: 6px 0 0;
  font-size: 0.82rem;
  color: var(--mute);
  word-break: break-word;
}

.card-delete {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--mute);
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
}

.card-delete:hover {
  background: var(--line);
  color: var(--ink);
}
</style>
