# Stock App — Diário de Progresso

Arquivo de contexto para novas sessões do Claude Code.
Registra o que foi feito, as decisões tomadas e o estado atual do projeto.

---

## 2026-03-27

### O que foi feito nesta sessão

#### 1. Criação do componente `Dashboard.tsx`

Criado `src/features/dashboard/Dashboard.tsx` com layout completo de plataforma de trading:

- **Topbar** com brand, ticker strip de mercado e área de ações (conta, busca, New Order, Session)
- **Sidebar** com perfil do investidor, menu de navegação (6 itens) e ativos fixados (pinned assets)
- **MainPanel** com asset strip (PETR4) e duas tabelas com scroll: Watchlist e Portfolio Positions
- **RightPanel** com dois painéis: Open Orders (6 ordens com status colorido) e Performance & Risk (5 métricas)
- Design tokens centralizados no objeto `c` (sem ThemeProvider); estilização via `sx`
- Layout via `Grid` do MUI v7 com `columns={{ xs: 4, md: 12 }}`: Sidebar (2) + MainPanel (7) + RightPanel (3)

---

#### 2. Responsividade do `RightPanel` — toggle em `≤ 1316px`

**Breakpoint customizado** detectado via `useMediaQuery('(max-width: 1316px)')` → `isCompact`.

**Comportamento abaixo de 1316px:**
- `RightPanel` removido do Grid
- `MainPanel` expande de `md: 7` para `md: 10` colunas
- Botão flutuante (`position: fixed`, canto superior direito, `top: 66, right: 12`) com ícone de painel lateral SVG
- Ao clicar, `RightPanel` desliza da direita com `translateX` animado (220ms, `cubic-bezier(0.4,0,0.2,1)`)
- Backdrop semitransparente (`rgba(0,0,0,0.5)`) com fade-in/out; clicar fecha o painel
- Ícone alterna entre painel lateral (fechado) e X (aberto)
- `useEffect` fecha o painel ao voltar para `> 1316px`

---

#### 3. Responsividade da `Sidebar` — toggle em `≤ 900px`

**Breakpoint customizado** detectado via `useMediaQuery('(max-width: 900px)')` → `isMoreCompact`.

**Comportamento abaixo de 900px:**
- `Sidebar` removida do Grid
- `MainPanel` expande para `md: 12` colunas (tela inteira)
- Botão flutuante (`position: fixed`, canto superior esquerdo, `top: 66, left: 12`) com ícone hamburger SVG (☰)
- Ao clicar, `Sidebar` desliza da **esquerda** com `translateX(-100% → 0)` animado
- Mesmo padrão de backdrop e `useEffect` do RightPanel
- Ícone alterna entre hamburger (fechado) e X (aberto)

---

### Hierarquia de breakpoints do Dashboard

| Largura       | Sidebar             | MainPanel      | RightPanel          |
|---------------|---------------------|----------------|---------------------|
| > 1316px      | Grid (md: 2)        | Grid (md: 7)   | Grid (md: 3)        |
| 900–1316px    | Grid (md: 2)        | Grid (md: 10)  | Toggle fixo direito |
| ≤ 900px       | Toggle fixo esquerdo | Grid (md: 12) | Toggle fixo direito |

---

### Padrão estabelecido para overlays de toggle

```tsx
// Detecção
const isCompact = useMediaQuery('(max-width: 1316px)');
const [panelOpen, setPanelOpen] = useState(false);
useEffect(() => { if (!isCompact) setPanelOpen(false); }, [isCompact]);

// Backdrop
<Box onClick={() => setPanelOpen(false)} sx={{
  position: 'fixed', inset: 0,
  bgcolor: 'rgba(0,0,0,0.5)', zIndex: 50,
  opacity: panelOpen ? 1 : 0,
  pointerEvents: panelOpen ? 'auto' : 'none',
  transition: 'opacity 220ms ease',
}} />

// Slide-in (direita → translateX(100%), esquerda → translateX(-100%))
<Box sx={{
  position: 'fixed', top: 54, right: 0, bottom: 0, width: 300,
  zIndex: 60,
  transform: panelOpen ? 'translateX(0)' : 'translateX(100%)',
  transition: 'transform 220ms cubic-bezier(0.4,0,0.2,1)',
}} />

// Botão toggle
<IconButton sx={{ position: 'fixed', top: 66, right: 12, zIndex: 70 }} />
```

**z-index:** backdrop 50 → painel 60 → botão 70 (por direção; esquerda e direita compartilham a mesma faixa)

---

## 2026-03-26

### Contexto do projeto

- **App:** `stock-react-app` — React 19 + Vite, criado com template padrão do Vite
- **Stack:** React 19, TypeScript, Vite, React Router v7, Redux Toolkit, Material UI v7 (`@mui/material ^7.3.9`) com `@emotion/react` e `@emotion/styled`
- **Roteamento:** `BrowserRouter` + `Routes` em `src/main.tsx`, com Redux `<Provider>` na raiz
- **Rotas existentes ao final da sessão:**
  - `/` → `src/features/login/Home.tsx`
  - `/login` → `src/features/login/Login.tsx` _(criada nesta sessão)_
  - `/my-stocks` → `src/features/stocks/MyStocks.tsx`
  - `/my-funds` → `src/features/portfolio/MyFunds.tsx`

---

### O que foi feito nesta sessão

#### 1. Conversão do `index-login.html` → `Login.tsx`

O arquivo `index-login.html` (localizado na raiz do workspace, fora do React app) continha o design estático da tela de login da plataforma **MoneyBuilder Broker**. O objetivo foi transformá-lo em um componente React usando Material UI v7.

**Arquivo criado:** `src/features/login/Login.tsx`

**Componentes internos definidos no arquivo:**

| Componente     | MUI utilizado                                                                                             | Responsabilidade                                       |
| -------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `TopBar`       | `AppBar`, `Toolbar`, `Box`, `Typography`                                                                  | Barra superior com logo e ticker strip de mercado      |
| `TrustItem`    | `Box`, `Typography`                                                                                       | Item reutilizável da lista de garantias institucionais |
| `ContextPanel` | `Paper`, `Grid`, `Typography`                                                                             | Painel de contexto institucional (lado direito)        |
| `LoginPanel`   | `Paper`, `Grid`, `TextField`, `Button`, `Checkbox`, `FormControlLabel`, `Link`, `Alert`, `InputAdornment` | Painel com formulário de login (lado esquerdo)         |
| `Login`        | `Box`, `Container`, `Grid`                                                                                | Página raiz que compõe os demais                       |

**Design tokens** centralizados no objeto `c` (objeto literal no topo do arquivo), espelhando as CSS variables do HTML original (`--bg-base`, `--text-primary`, etc.).

**Dados estáticos** em constantes de módulo: `TICKERS` (array com IBOV, USD/BRL, IFIX) e `TRUST_ITEMS` (array com 3 itens de garantia).

**Estados React em `LoginPanel`:**

- `showPassword` — alterna visibilidade da senha (botão Show/Hide no `InputAdornment`)
- `rememberDevice` — checkbox "Remember this trusted device"
- `showError` — controla exibição do `Alert` de erro de autenticação (inicializado como `true` para refletir o HTML original)

**Estilo:** sem ThemeProvider global; toda estilização via prop `sx` com valores inline. Animações CSS (`panelRise`, `sweep`, `pulse`) definidas com `@keyframes` dentro do `sx`.

**API MUI v7 utilizada:**

- `slotProps` no `TextField` (em vez do `InputProps` depreciado)
- `size` prop no `Grid` (Grid2 API que se tornou padrão no v7)

---

#### 2. Registro da rota em `main.tsx`

```tsx
import Login from './features/login/Login.tsx';
// ...
<Route path="login" element={<Login />} />;
```

---

#### 3. Sistema de grid responsivo — colunas

A `<main>` da página `Login` foi refatorada para usar `Container` + `Grid` do MUI em vez de um `display: grid` CSS fixo.

**Lógica de colunas:**

```tsx
<Grid
  container
  columns={{ xs: 4, md: 12 }} // 4-col no mobile, 12-col no desktop
  spacing={{ xs: 3, md: 4 }}
  alignItems="stretch"
>
  <Grid size={{ xs: 4, md: 7 }}>
    {' '}
    {/* LoginPanel — 7/12 no desktop */}
    <LoginPanel />
  </Grid>
  <Grid size={{ xs: 4, md: 5 }}>
    {' '}
    {/* ContextPanel — 5/12 no desktop */}
    <ContextPanel />
  </Grid>
</Grid>
```

- No mobile (`xs`): os dois painéis empilham verticalmente, LoginPanel primeiro
- No desktop (`md`): lado a lado, LoginPanel à esquerda (maior), ContextPanel à direita
- O ticker strip do `TopBar` é oculto no mobile via `display: { xs: 'none', md: 'flex' }`
- Padding da `<main>` responsivo: `py: { xs: 4, md: 7 }`
- Container: `maxWidth="lg"` (~1200px)

---

#### 4. Sistema de grid responsivo — linhas

O interior de cada painel foi refatorado para usar `Grid` rows explícitas, tornando o layout **verdadeiramente 2D** (colunas + linhas).

**Estrutura de linhas em `ContextPanel`:**

```
Grid container (sem rowSpacing — mt manual por seção)
  Row 1 — Título h2                   [size={12}]
  Row 2 — Descrição                   [size={12}, mt: 1.5  → 12px]
  Row 3 — Trust items                 [size={12}, mt: 2.75 → 22px]
    └── Grid container rowSpacing={1.25}  (10px entre itens)
        TrustItem × 3                 [size={12}]
  Row 4 — Market note (border-top)    [size={12}, mt: 2.25 → 18px]
    └── Grid spacing={2.25}
        Latency + System Status       [size="auto"]
  Row 5 — Micro text                  [size={12}, mt: 2    → 16px]
```

**Estrutura de linhas em `LoginPanel`:**

```
Grid container (position: relative, zIndex: 1 — acima do pseudo-elemento ::before)
  Row 1 — Título h3 + subtítulo       [size={12}]
  Row 2 — Formulário                  [size={12}, mt: 2.25 → 18px]
    └── Grid container rowSpacing={1.5}  (12px entre campos)
        Row — TextField identifier    [size={12}]
        Row — TextField password      [size={12}]
        Row — Remember + Forgot       [size={12}]
          └── Grid columns={12}
              Checkbox  [size={8}]  |  Link  [size={4}]
        Row — Button Sign In          [size={12}]
  Row 3 — Alert de erro (condicional) [size={12}, mt: 1.5]
  Row 4 — Support footer (border-top) [size={12}, mt: 2]
    └── Grid columns={12}
        Texto suporte [size={8}]  |  Link contato [size={4}]
```

**Convenção de espaçamento:** todos os `mt` usam o sistema de spacing do MUI (múltiplos de 8px). Ex: `mt: 1.5` = 12px, `mt: 2` = 16px, `mt: 2.25` = 18px, `mt: 2.75` = 22px.

---

#### 5. Ajuste manual pelo desenvolvedor

O alinhamento final dos cards (`LoginPanel` e `ContextPanel`) dentro do layout de colunas e linhas foi ajustado manualmente pelo desenvolvedor após as etapas acima.

---

### Estado atual dos arquivos relevantes

```
src/
├── main.tsx                          — rotas registradas, Provider configurado
├── store.ts                          — Redux store
├── hooks.ts                          — hooks tipados do Redux
└── features/
    ├── login/
    │   ├── Home.tsx                  — rota "/"  (existia antes)
    │   └── Login.tsx                 — rota "/login" (criada nesta sessão)
    ├── stocks/
    │   ├── MyStocks.tsx              — rota "/my-stocks"
    │   └── stocksSlice.ts
    ├── portfolio/
    │   ├── MyFunds.tsx               — rota "/my-funds"
    │   └── portfolioSlice.ts
    ├── counter/
    │   ├── Counter.tsx
    │   └── counterSlice.ts
    ├── orders/
    │   └── ordersSlice.ts
    └── ui/
        └── uiSlice.ts
```

---

### Decisões e padrões estabelecidos

- **MUI v7:** usar `slotProps` (não `InputProps`), usar `Grid size={n}` (não `xs`/`md` direto na prop), usar `Grid container columns={{ xs: 4, md: 12 }}` para grids responsivos
- **Sem ThemeProvider global por enquanto:** estilização via `sx` inline, design tokens no objeto `c`
- **Componentes de página:** sub-componentes internos (não exportados) definidos no mesmo arquivo da página enquanto forem usados apenas ali
- **Grid interno de painéis:** usar `Grid container` + `Grid size={12}` para cada seção vertical ("row"), com `mt` em múltiplos de `0.25` do spacing MUI
- **Espaçamento base:** 8px (padrão MUI). Todos os espaços verticais são múltiplos dele

---

#### 4. Criação do componente `Book.tsx` — Order Negotiation Book

Criado `src/features/book/Book.tsx` a partir do `index-book.html`, seguindo o mesmo padrão do `Dashboard.tsx`.

**Rota registrada:** `/book`

**Estrutura de componentes internos:**

| Componente        | Responsabilidade                                                                 |
|-------------------|----------------------------------------------------------------------------------|
| `BookTopBar`      | Barra superior com brand, tickers e chips Conta/Session                         |
| `Sidebar`         | Nav com "Trade / Book" ativo, Pinned Tickers, footer de latência                |
| `BookSectionHeader` | Cabeçalho de colunas (Qtd / Corretora / Ordens / Preço) reutilizável          |
| `BookRow`         | Linha de oferta com barra de profundidade (depth bar) proporcional à quantidade |
| `OrderBook`       | Book de ofertas em duas seções verticais: Venda (Ask) → Spread → Compra (Bid)  |
| `OrderTicket`     | Formulário de envio de ordens com toggle Buy/Sell e 6 campos                   |
| `OrdersTable`     | Tabela de ordens abertas com badge de status colorido                           |
| `MainPanel`       | Layout de **2 colunas**: OrderBook (col 1) | OrderTicket + OrdersTable (col 2)  |
| `RightPanel`      | Risk & Exposure, Compliance Checks, Broker Alerts                               |

**Destaques do `OrderBook`:**

- Seção **Venda** no topo: asks ordenados do pior (preço mais alto) ao melhor (mais baixo); header vermelho com total de níveis e unidades
- Linha de **Spread** central: exibe Melhor Bid | Spread | Melhor Ask
- Seção **Compra** na base: bids ordenados do melhor (mais alto) ao pior; header verde com totais
- **Depth bar** em cada linha: `Box` com `position: absolute`, largura proporcional à quantidade (`qty / 4000 * 100%`), colorido com `rgba` translúcido (verde/vermelho)

**Layout do `MainPanel`:**

```
┌──────────────────────────────────────────────┐
│  Asset header (PETR4 · Bid · Ask · Day)       │
├──────────────────────┬───────────────────────┤
│                      │  OrderTicket           │
│    OrderBook         ├───────────────────────┤
│  (Sell → Spread      │  OrdersTable           │
│   → Buy)             │  (ordens abertas)      │
└──────────────────────┴───────────────────────┘
```

**Dados estáticos:** `ASK_ROWS` (8 níveis), `BID_ROWS` (8 níveis), `TIME_SALES`, `QUICK_STRATEGY`, `ORDERS_DATA`, `RISK_ITEMS`, `COMPLIANCE_ITEMS`, `BROKER_ALERTS`.

---

#### 5. Correção de altura dos painéis (`alignItems="stretch"` + `overflow: hidden`)

Problema identificado: o `MainPanel` ficava mais curto que `Sidebar` e `RightPanel`.

**Causa:** `alignItems="stretch"` estava comentado no Grid, e o wrapper do conteúdo usava `overflow: scroll` em vez de `overflow: hidden`.

**Correções em `Book.tsx`:**

```tsx
// Grid: restaurar alignItems="stretch"
<Grid container columns={{ xs: 4, md: 12 }} spacing={1.25} alignItems="stretch" sx={{ height: '100%' }}>

// Wrapper do conteúdo: overflow hidden (não scroll)
<Box sx={{ p: '2rem', overflow: 'hidden', height: '100%', boxSizing: 'border-box' }}>
```

**Por que funciona:** `overflow: scroll` cria um scroll container independente — os filhos com `height: '100%'` ficam relativos a esse container em vez de ao viewport disponível, quebrando o `alignItems="stretch"`. Com `hidden`, o Grid determina a altura e todos os painéis se esticam até a coluna mais alta.

**Padrão a seguir em todas as páginas com layout de 3 colunas.**

---

#### 6. Criação do componente `User.tsx` — User Profile & Funding

Criado `src/features/user/User.tsx` a partir do `index-user.html`, com o mesmo padrão das páginas anteriores. Serve como base para futura edição de dados de usuário.

**Rota registrada:** `/user`

**Estrutura de componentes internos:**

| Componente      | Responsabilidade                                                                          |
|-----------------|-------------------------------------------------------------------------------------------|
| `UserTopBar`    | Barra superior com brand, tickers e chips de conta/sessão                                |
| `Sidebar`       | Nav com "User" ativo, Quick Balances (Cash / Pending / Credit), footer de latência       |
| `Field`         | Campo de formulário reutilizável — `type: 'input'` ou `type: 'select'`                   |
| `ActionBtn`     | Botão de ação reutilizável com variante `primary` (azul) e padrão (escuro)               |
| `FormPanel`     | Container de formulário com título, grid 2×N de `Field`s e hint text                    |
| `MainPanel`     | Página de edição com header, summary tiles, 2 formulários, security rows e deposit form  |
| `LogItem`       | Linha de log com suporte a prefixo colorido ("Status:" verde / "Risk signal:" vermelho)  |
| `RightInfoBox`  | Box do painel direito com título uppercase e filhos genéricos                            |
| `RightPanel`    | Recent Account Events, Pending Requests, Compliance Notices                              |

**Estrutura vertical do `MainPanel`:**

1. **Header** — título "User Profile & Funding" + botões Save Changes / Cancel / Reset
2. **Summary tiles** (grid 3 colunas) — Verification Status · Security Posture · Funding Availability
3. **Formulários** (grid 2 colunas):
   - `FormPanel` "Personal Data" — 6 campos: First Name, Last Name, Email, Phone, CPF, Date of Birth
   - `FormPanel` "Contact & Compliance" — 6 campos: Address, City, State (select), ZIP, Tax Residency (select), Professional Profile (select)
4. **Security** — 3 linhas (Password · 2FA · Trusted Devices) com botão de ação
5. **Deposit Funds** — grid `1fr 1fr 1fr auto` com Amount, Source Account (select), Method (select) e botão + nota de aviso em vermelho

**Componente `Field` reutilizável:**

```tsx
function Field({ label, value, type = 'input', options = [] }) {
  // type === 'select' → MUI Select com MenuItem
  // type === 'input'  → Box component="input" com sx estilizado
}
```

---

### Estado atual das rotas (ao final desta sessão)

| Rota          | Componente                                  |
|---------------|---------------------------------------------|
| `/`           | `src/features/login/Home.tsx`               |
| `/login`      | `src/features/login/Login.tsx`              |
| `/dashboard`  | `src/features/dashboard/Dashboard.tsx`      |
| `/my-stocks`  | `src/features/stocks/MyStocks.tsx`          |
| `/my-funds`   | `src/features/portfolio/MyFunds.tsx`        |
| `/book`       | `src/features/book/Book.tsx`                |
| `/user`       | `src/features/user/User.tsx`                |

---

## 2026-04-03

### O que foi feito nesta sessão

#### Refatoração do `DataTable` no `Dashboard.tsx` — uso de dados reais da API

**Contexto:** O componente `DataTable`, usado na seção Watchlist do `MainPanel`, renderizava dados estáticos (`WATCHLIST_DATA: string[][]`). O `MainPanel` já buscava os dados reais de ações via `fetchStocks()` e guardava no estado `stocks: Stock[]`, mas esse estado não era usado na tabela.

**O que foi mudado:**

1. **Tipo de `rows` alterado de `string[][]` para `Stock[]`** no componente `DataTable`

2. **Nova lógica de renderização das linhas:** ao invés de iterar sobre células genéricas, cada linha agora mapeia campos específicos do objeto `Stock` para as colunas existentes:

   | Coluna  | Campo do `Stock`      | Formatação                                      |
   |---------|-----------------------|-------------------------------------------------|
   | Ticker  | `symbol`              | sem formatação, negrito                         |
   | Last    | `current_price`       | `toFixed(2)`                                    |
   | Day     | `percentage_change`   | `+X.XX%` ou `-X.XX%`; cor verde/vermelho        |
   | Vol     | `current_volume`      | helper `formatVolume` → `85.0M`, `1.2K`, etc.   |

3. **Helper `formatVolume` adicionado:** converte número bruto (`85000000`) para formato legível (`85.0M`).

4. **`StringDataTable` criado:** cópia do comportamento original do `DataTable` (`rows: string[][]`) para a tabela de Portfolio Positions, que ainda usa dados estáticos e não foi alterada.

5. **Chamada da Watchlist atualizada:** `rows={WATCHLIST_DATA}` → `rows={stocks}`

**Motivação:** desacoplar a UI da Watchlist dos dados mock e conectá-la ao estado real populado pela API.

---

### Estado atual da estrutura de arquivos

```
src/
├── main.tsx
├── store.ts
├── hooks.ts
└── features/
    ├── login/
    │   ├── Home.tsx
    │   └── Login.tsx
    ├── dashboard/
    │   └── Dashboard.tsx
    ├── book/
    │   └── Book.tsx
    ├── user/
    │   └── User.tsx
    ├── stocks/
    │   ├── MyStocks.tsx
    │   └── stocksSlice.ts
    ├── portfolio/
    │   ├── MyFunds.tsx
    │   └── portfolioSlice.ts
    ├── orders/
    │   └── ordersSlice.ts
    ├── counter/
    │   ├── Counter.tsx
    │   └── counterSlice.ts
    └── ui/
        └── uiSlice.ts
```
