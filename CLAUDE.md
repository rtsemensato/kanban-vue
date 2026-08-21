# CLAUDE.md — Kanban

Stack: Vue 3 (Composition API, `<script setup>`) + TypeScript + Vite + Pinia

Board de Kanban com três colunas fixas (A fazer / Fazendo / Feito), drag-and-drop nativo e persistência em `localStorage`. Sem backend, sem rotas, um único `App.vue`.

---

## Arquitetura em uma linha

`stores/board.ts` (Pinia, fonte da verdade + persistência) → `BoardColumn.vue` (drag-and-drop, layout de coluna) → `BoardCard.vue` (apresentação pura) / `AddCardForm.vue` (criação de cartão)

Nenhum componente acessa `localStorage` diretamente, só a store.

---

## Store (Pinia)

- `columns` é `reactive`, não `ref`: os componentes mutam campos/arrays direto (`column.cards.push(...)`), sem `.value`.
- Toda mutação passa por uma action da store (`addCard`, `deleteCard`, `moveCard`). Componentes nunca fazem `column.cards.splice(...)` direto, senão a persistência automática não é acionada de forma confiável.
- `watch(columns, ..., { deep: true })` grava no `localStorage` a cada mutação. Sem debounce: o board é pequeno o bastante pra não precisar.
- `moveCard(cardId, fromColumnId, toColumnId, toIndex)` faz splice na coluna de origem e reinsere na de destino, cobrindo inclusive reordenar dentro da mesma coluna (`fromColumnId === toColumnId`).

## Drag-and-drop

HTML5 Drag and Drop API nativa, sem biblioteca (`vuedraggable`, `sortablejs` etc.), de propósito, pra manter a dependência mínima num projeto desse porte.

- `dragstart` no wrapper do cartão grava `{ cardId, fromColumnId }` via `event.dataTransfer.setData('application/json', ...)`.
- `dragover`/`drop` ficam na coluna (`BoardColumn.vue`), não no cartão: o índice de destino é calculado comparando `event.clientY` com o `getBoundingClientRect()` de cada cartão já renderizado (refs coletadas num array, `setCardRef`).
- Consequência: se a estrutura do DOM do cartão mudar (ex: um wrapper novo em volta), `dropIndexFromEvent` pode quebrar o cálculo. Testar drag-and-drop manualmente depois de qualquer mudança de layout do card.

## Toolchain: pontos frágeis conhecidos

Esse projeto foi criado com `npm create vue@latest` numa época em que o template puxou versões muito recentes com bugs reais:

- `oxlint` e `eslint-plugin-oxlint` vinham com versões incompatíveis entre si (`~1.74` vs peer exigindo `~1.73`), o que quebrava o `npm install`. Corrigido fixando `oxlint` em `~1.73.0` no `package.json`.
- Vite 8 (bundler Rolldown) não resolvia `@vue/devtools-api` (dependência opcional do Pinia), o que quebrava o `npm run build`. Corrigido adicionando `@vue/devtools-api` como dependência direta.

Se `npm install` ou `npm run build` voltar a falhar depois de um `npm update`, esses dois pontos são os primeiros suspeitos.

---

## O que evitar

- **Mutar `column.cards` fora de uma action da store.** Quebra a garantia de persistência automática.
- **Adicionar uma lib de drag-and-drop sem necessidade real.** O board é simples o bastante pra HTML5 DnD nativo dar conta.
- **Rodar `npm update` sem revisar o changelog de `vite`, `oxlint` e `@vue/devtools-api`.** São os três pontos frágeis do toolchain (ver seção acima).
