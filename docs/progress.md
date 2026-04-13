# Project Progress

## Repository

- **URL**: https://github.com/pdrboni/stock-market-app.git
- **Main branch**: main

## Stack

- **Frontend**: React + TypeScript (Vite), MUI, Redux Toolkit, React Router
- **Backend**: Node.js (Express), PostgreSQL

## Progress Log

### 2026-04-09 — Portfolio.tsx e navegação na Sidebar

#### Portfolio.tsx
- Criado `src/features/portfolio/Portfolio.tsx` a partir do `index-portfolio.html`, seguindo o mesmo padrão visual e estrutural de `Dashboard.tsx` e `Book.tsx`
- Layout 3 colunas: `Sidebar (218px) | Main Panel (1fr) | Utility Panel (324px)`
- Responsivo via `useMediaQuery('(max-width:900px)')`: em mobile a Sidebar some e vira um botão flutuante hamburger/X (backdrop + slide-in), idêntico ao comportamento do `Dashboard.tsx`
- Holdings table dinâmica via `fetchChart(user_id)`: exibe Asset, Qty, Avg Price, Last, Day %, Allocation (calculada como `qty × lastPrice / totalAllocated`)
- Utility panel com Watchlist Mini, Pending Actions e Alert Feed

#### Métricas e Action Card
- Seção de summary reestruturada para 3 colunas: Total Equity | Available Cash | Action Card (span duplo)
- Card "Available Cash" lê `user.available_cash` do Redux via `selectUser`, formatado como `R$ X.XXX,XX`
- Action card substitui os cards estáticos de Month P/L e Portfolio VaR 95%
- Botões "Deposit" e "Withdraw" no header funcionam como toggles que controlam o conteúdo do action card:
  - `null` → mensagem orientando o usuário
  - `deposit` → input R$ + botão Submit (chama `POST /api/transactions` com `type: 'DEPOSIT'` e atualiza Redux)
  - `withdraw` → input R$ + Select com contas bancárias hardcoded (Banco do Brasil, Nubank) + botão Submit (chama `POST /api/transactions` com `type: 'WITHDRAWAL'` e atualiza Redux)

#### Sidebar — navegação por rota
- `NAV_ITEMS` convertido para `{ label, path }` com as rotas `/dashboard`, `/user`, `/portfolio` (Book removido)
- `useState('Dashboard')` substituído por `useNavigate` + `useLocation`: item ativo determinado pelo `pathname` real
- Cada botão chama `navigate(path)` ao clicar

#### Roteamento (main.tsx)
- `MyFunds` removido; rota `/portfolio` agora aponta para `<Portfolio />`

### 2026-04-08 — Book de ordens e componentização

#### Book.tsx
- Book de Sell ordenado por maior preço primeiro; Book de Buy também ordenado por maior preço primeiro (padrão convencional de order book, proximidade ao spread)
- `checkOrderMatch` implementada: ao submeter uma ordem, verifica se há contrapartida no book (SELL ≤ preço da BUY, ou BUY ≥ preço da SELL) para o mesmo stock, excluindo o próprio usuário
- Em caso de match: deleta ambas as transactions via `DELETE /api/transactions`, remove a ação do portfolio do vendedor via `DELETE /api/charts` e adiciona no portfolio do comprador via `POST /api/charts` — tudo em paralelo com `Promise.all`

#### Componentização
- `Sidebar` extraído de `Dashboard.tsx` para `src/components/Sidebar.tsx` (reutilizável)
- `Book.tsx` passou a usar o `Sidebar` do componente compartilhado, removendo a definição local

#### Available Cash dinâmico
- `authSlice` recebeu a chave `available_cash` no objeto `user`
- Cálculo do saldo disponível (`DEPOSIT` soma, `BUY` subtrai `price × quantity`, `WITHDRAWAL` subtrai `price`, `SELL` não altera) movido para o `LoginPanel` logo após o login — resultado despachado via `setUser`
- `Sidebar` passou a ler `user.available_cash` diretamente do Redux, sem fetch próprio

### 2026-04-07 — Dashboard dinâmico
- Asset strip do `MainPanel` agora exibe dados da stock selecionada na watchlist (symbol, name, last price, day %, volume); ao clicar em uma linha a linha fica destacada e o header atualiza
- Portfolio Positions substituído de dados estáticos para dados reais da API via `fetchChart`; coluna "Unrealized P/L" removida e "Allocation" calculada dinamicamente como `(qty × close) / totalAllocado`
- Interface `Chart` atualizada com `percentage_change` e `close`
