# Project Progress

## Repository

- **URL**: https://github.com/pdrboni/stock-market-app.git
- **Main branch**: main

## Stack

- **Frontend**: React + TypeScript (Vite), MUI, Redux Toolkit, React Router
- **Backend**: Node.js (Express), PostgreSQL

## Progress Log

### 2026-04-07 — Capturando chart do usuário
- Adicionada interface `Chart` com campos `percentage_change` e `close` em `src/utils/chart.ts`
- Criado componente `PositionsTable` no Dashboard para exibir posições do portfólio com dados dinâmicos da API
- Allocation calculada como `(qty * close) / totalAllocated * 100`
- Removidos dados estáticos de posições (`POSITIONS_COLS`, `POSITIONS_DATA`)

### 2026-04-06 — Asset strip dinâmico
- Box do asset strip no `MainPanel` passou a exibir dados da stock selecionada na watchlist
- Adicionado estado `selectedStock` e prop `onRowClick` no componente `DataTable`
- Linha selecionada na watchlist recebe destaque visual
