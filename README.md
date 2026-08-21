# Kanban

Board de Kanban simples: três colunas fixas (A fazer / Fazendo / Feito), cartões
com título e descrição, drag-and-drop nativo (HTML5 Drag and Drop API, sem
biblioteca extra) e persistência em `localStorage`. Sem backend.

Projeto pessoal pra praticar Vue 3 (Composition API, `<script setup>`) e Pinia.

**Ao vivo**: [kanban-vue-seven.vercel.app](https://kanban-vue-seven.vercel.app)

## Estrutura do repositório

```
src/
├── types.ts               # KanbanCard, KanbanColumn, ColumnId
├── stores/
│   └── board.ts            # Pinia: estado, persistência em localStorage, actions
├── components/
│   ├── BoardColumn.vue     # coluna: drag-and-drop (dragover/drop) + lista de cartões
│   ├── BoardCard.vue       # apresentação pura de um cartão
│   └── AddCardForm.vue     # formulário inline de criação de cartão
├── App.vue                 # shell: cabeçalho + as 3 colunas
└── assets/main.css         # tokens de tema (cores, radius) + reset
```

## Rodando localmente

```sh
npm install
npm run dev
```

Abre em [http://localhost:5173](http://localhost:5173).

## Scripts

```sh
npm run build   # type-check + build de produção
npm run lint    # eslint + oxlint com --fix
npm run format  # prettier
```

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Vue 3, Composition API (`<script setup>`) |
| Build | Vite |
| Estado | Pinia |
| Linguagem | TypeScript |
| Lint / Format | ESLint + oxlint / Prettier |

## Decisões técnicas

### Drag-and-drop nativo, sem biblioteca

Nada de `vuedraggable`/`sortablejs`. O board é pequeno o suficiente pra
justificar usar a HTML5 Drag and Drop API direto: `dragstart` no cartão grava
`{ cardId, fromColumnId }` no `dataTransfer`, e a coluna de destino calcula o
índice de inserção comparando a posição do mouse (`clientY`) com o
`getBoundingClientRect()` de cada cartão já renderizado.

### Pinia como única fonte de verdade, `localStorage` só reflete a store

Todo estado (colunas e cartões) vive na store. Um único `watch` com
`deep: true` observa a store inteira e serializa pro `localStorage` a cada
mutação. Nenhum componente lê ou escreve em `localStorage` diretamente, isso
mantém a persistência automática e consistente não importa qual action foi
chamada.

### Toolchain: duas correções por versões recentes com bug

O scaffold inicial (`npm create vue@latest`) puxou:

- `oxlint`/`eslint-plugin-oxlint` em versões com peer dependency
  incompatível entre si, quebrando `npm install`. Corrigido fixando
  `oxlint` em `~1.73.0`.
- Vite 8 (bundler Rolldown) que não resolvia `@vue/devtools-api`
  (dependência opcional do Pinia), quebrando `npm run build`. Corrigido
  adicionando `@vue/devtools-api` como dependência direta.

Ver [`CLAUDE.md`](CLAUDE.md) para mais detalhes de arquitetura e convenções.
