# Autenticação, Cookies e CORS — Estudo de Caso

## O problema encontrado

Ao tentar buscar os stocks da API, a requisição retornava **401 Unauthorized** com a mensagem
`"Token não fornecido"`, mesmo após o login ter sido feito com sucesso.

---

## Por que o cookie foi descartado silenciosamente?

O backend enviou o cookie corretamente na resposta do login:

```
Set-Cookie: token=<jwt>; HttpOnly; SameSite=Lax
```

Porém o browser **ignorou** esse cookie sem emitir nenhum erro. O motivo é a política de
**CORS (Cross-Origin Resource Sharing)**.

O frontend roda em `http://localhost:5173` e o backend em `http://localhost:3000`. Para o
browser, portas diferentes configuram **origens diferentes** — isso é uma requisição
cross-origin.

Em requisições cross-origin, o browser aplica uma regra simples:

> Credenciais (cookies, cabeçalhos de autenticação, certificados TLS) só são enviadas e
> armazenadas se a requisição for feita explicitamente com `credentials: 'include'`.

Como o fetch do login não tinha essa opção, o browser recebeu o `Set-Cookie` do backend e
simplesmente o descartou — sem aviso, sem erro no console.

A correção foi adicionar `credentials: 'include'` ao fetch do login:

```ts
const res = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  credentials: 'include', // permite armazenar e reenviar cookies cross-origin
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
```

---

## Conceitos contemplados nesse estudo de caso

### 1. CORS (Cross-Origin Resource Sharing)

Mecanismo de segurança do browser que bloqueia requisições entre origens diferentes por
padrão. Uma "origem" é composta por protocolo + domínio + porta. `localhost:5173` e
`localhost:3000` são origens distintas.

O servidor precisa declarar explicitamente quais origens pode atender:

```js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // obrigatório para aceitar cookies cross-origin
}));
```

Sem `credentials: true` no backend e `credentials: 'include'` no frontend, cookies nunca
trafegam entre origens diferentes.

---

### 2. Cookies HttpOnly

Cookies podem ser criados de dois modos:

| Modo | Quem acessa | Risco |
|---|---|---|
| Cookie comum | JavaScript (`document.cookie`) + browser | Vulnerável a XSS |
| Cookie `HttpOnly` | Apenas o browser (invisível ao JS) | Protegido contra XSS |

O backend criou o cookie com `HttpOnly: true`, o que é a prática correta para tokens JWT.
Isso impediu que o frontend lesse o token via `document.cookie`, mas o browser deveria
enviá-lo automaticamente em toda requisição para a mesma origem — desde que a requisição
usasse `credentials: 'include'`.

---

### 3. JWT (JSON Web Token)

O token de autenticação gerado pelo backend é um JWT. Ele carrega informações do usuário
codificadas e assinadas com uma chave secreta (`JWT_SECRET`). O middleware do backend
verifica a assinatura do token a cada requisição protegida:

```js
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

Se o token for inválido, expirado ou ausente, a requisição é rejeitada com 401.

---

### 4. Middleware de autenticação

O backend protege rotas individualmente aplicando um middleware antes do controller:

```js
router.get('/stocks', authMiddleware, getStocks);
```

O `authMiddleware` lê o cookie, valida o JWT e só chama `next()` se tudo estiver correto.
Caso contrário, responde com 401 e a execução da rota é interrompida.

---

### 5. Rotas protegidas no frontend (Private Routes)

O mesmo conceito de proteção foi aplicado no frontend com React Router. Um componente
`PrivateRoute` verifica se o cookie de autenticação existe antes de renderizar a rota:

```tsx
export default function PrivateRoute() {
  const token = getTokenFromCookies();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
```

Isso impede o acesso visual às páginas protegidas, mas **não substitui** a validação no
backend — o frontend pode ser contornado, o backend não.

---

### 6. SameSite

O atributo `SameSite` do cookie controla quando ele é enviado:

| Valor | Comportamento |
|---|---|
| `Strict` | Só envia em requisições da mesma origem |
| `Lax` | Envia em navegações normais, bloqueia em requisições cross-site de terceiros |
| `None` | Envia sempre — exige `Secure` (HTTPS) |

O backend usou `SameSite: 'lax'`, adequado para desenvolvimento local. Em produção com
domínios diferentes, seria necessário `SameSite: 'none'` com `Secure: true`.

---

## Resumo do fluxo correto

```
1. POST /auth/login  (credentials: 'include')
        ↓
2. Backend valida senha → gera JWT → responde com Set-Cookie: token=<jwt>; HttpOnly
        ↓
3. Browser armazena o cookie (invisível ao JS)
        ↓
4. GET /api/stocks  (credentials: 'include')
        ↓
5. Browser envia automaticamente o cookie no header Cookie: token=<jwt>
        ↓
6. authMiddleware lê req.cookies.token → valida JWT → libera a rota
```
