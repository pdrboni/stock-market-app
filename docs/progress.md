# Project Progress

## Repository

- **URL**: https://github.com/pdrboni/stock-market-app.git
- **Main branch**: main

## Stack

- **Frontend**: React + TypeScript (Vite), MUI, Redux Toolkit, React Router
- **Backend**: Node.js (Express), PostgreSQL

## Progress Log

### 2026-04-07 — Dashboard dinâmico
- Asset strip do `MainPanel` agora exibe dados da stock selecionada na watchlist (symbol, name, last price, day %, volume); ao clicar em uma linha a linha fica destacada e o header atualiza
- Portfolio Positions substituído de dados estáticos para dados reais da API via `fetchChart`; coluna "Unrealized P/L" removida e "Allocation" calculada dinamicamente como `(qty × close) / totalAllocado`
- Interface `Chart` atualizada com `percentage_change` e `close`
