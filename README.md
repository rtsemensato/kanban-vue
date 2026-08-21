# Kanban

Board de Kanban simples: três colunas fixas (A fazer / Fazendo / Feito), cartões
com título e descrição, drag-and-drop nativo (HTML5 Drag and Drop API, sem
biblioteca extra) e persistência em `localStorage`. Sem backend.

Projeto pessoal pra praticar Vue 3 (Composition API, `<script setup>`) e Pinia.

## Stack

Vue 3 + TypeScript + Vite + Pinia. Lint com ESLint + oxlint, format com Prettier.

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
