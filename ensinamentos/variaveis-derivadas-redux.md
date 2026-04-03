# Variáveis derivadas de estado Redux

## Contexto

No componente `DataTable` (Dashboard.tsx), precisávamos saber quais stocks estavam pinadas para
controlar o ícone do botão. A primeira ideia foi usar `useState` ou `useMemo` para guardar um
`Set` de IDs pinados.

## O que foi feito

```ts
const pinnedStocks = useAppSelector(selectPinnedStocks);
const pinnedIds = new Set(pinnedStocks.map((s) => s.id));
```

`pinnedIds` é uma variável comum, declarada inline — sem `useState` nem `useMemo`.

## Por que funciona

1. `useAppSelector` escuta o Redux store. Quando `pinnedStocks` muda, ele força um **re-render**.
2. Em cada render, todo o corpo do componente re-executa — inclusive a linha que cria `pinnedIds`.
3. Logo, `pinnedIds` sempre reflete o estado atual do Redux.

Isso vale para qualquer valor derivado de estado (Redux, `useState`, `useContext`): se a fonte
muda e causa re-render, os derivados inline são recalculados automaticamente.

## Quando usar useMemo

`useMemo` seria adequado apenas por **performance** — se a derivação fosse custosa (ex: filtrar
uma lista de milhares de itens). Para um `Set` construído a partir de poucos elementos, o custo
é desprezível e o `useMemo` só adicionaria complexidade sem benefício.
