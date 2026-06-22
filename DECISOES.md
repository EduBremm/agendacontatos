# DECISOES.md — Registro de Decisões Técnicas

## 1. Tecnologia escolhida: React Native + Expo

**Decisão:** React Native com Expo no modo managed workflow.

**Justificativa:**
- Ecossistema unificado JavaScript/TypeScript elimina a necessidade de manter código separado por plataforma
- Expo acelera o bootstrap: sem configurações de Xcode/Gradle para funcionalidades básicas
- Hot reload e Expo Go permitem testar em dispositivo real sem build nativo
- TypeScript com `expo/tsconfig.base` entrega configuração de compilador pronta e estrita

---

## 2. Persistência: expo-sqlite

**Decisão:** `expo-sqlite` com API síncrona (`openDatabaseSync`).

**Justificativa:**
- Banco relacional local — dados persistem em disco mesmo após fechar o app
- API síncrona simplifica o código: sem `async/await` em funções de CRUD simples, sem risco de condição de corrida
- SQLite já está embutido no Expo, sem dependências extras nativas
- Alternativas descartadas:
  - AsyncStorage: chave-valor, não relacional, ruim para buscas
  - MMKV: rápido mas também chave-valor
  - Realm: pesado demais para o escopo

---

## 3. Navegação: Stack Navigator

**Decisão:** `@react-navigation/stack` com 3 telas em pilha.

**Justificativa:**
- Fluxo linear (Lista → Detalhes → Formulário) é naturalmente uma pilha
- Stack Navigator oferece `route.params` tipado via `RootStackParamList`, eliminando casting manual
- `useFocusEffect` permite recarregar dados ao voltar para `ContactsList` sem estado global
- Comunicação entre telas via `route.params`:
  - `ContactDetails` recebe `{ contact: Contact }` ao navegar da lista
  - `ContactForm` recebe `{ contact?: Contact }` — `undefined` = cadastro, objeto = edição

---

## 4. Funcionalidade que não deu tempo: busca avançada

Implementamos busca por **nome** e **telefone** com filtro local (em memória).

Não foi implementado: busca por **e-mail** e **aniversário**. A expansão exigiria estender o predicado de filtro em `ContactsListScreen`:

```typescript
// Para incluir e-mail e aniversário no filtro:
const contatosFiltrados = contacts.filter((c) => {
  const termo = busca.toLowerCase();
  return (
    c.name.toLowerCase().includes(termo) ||
    c.phone.includes(busca) ||
    (c.email?.toLowerCase().includes(termo) ?? false) ||
    (c.birthday?.includes(busca) ?? false)
  );
});
```

Também não foi implementado: ordenação por aniversário próximo e exportação de contatos.

---

## 5. Trecho escrito sem IA: `initDatabase()`

```typescript
// src/database/database.ts

const db = SQLite.openDatabaseSync('contacts.db');

export function initDatabase(): void {
  db.execSync('PRAGMA journal_mode = WAL;');
  db.execSync(`
    CREATE TABLE IF NOT EXISTS contacts (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      name     TEXT    NOT NULL,
      phone    TEXT    NOT NULL,
      email    TEXT,
      birthday TEXT
    );
  `);
}
```

**Por que esse trecho foi escrito manualmente:**

- `PRAGMA journal_mode = WAL` foi adicionado conscientemente — WAL (Write-Ahead Logging) melhora a performance de escrita e evita locks que bloqueariam leituras concorrentes. Essa decisão vem de experiência com SQLite em produção e não é gerada automaticamente por ferramentas.
- `CREATE TABLE IF NOT EXISTS` garante idempotência: chamar `initDatabase()` múltiplas vezes (ex.: por acidente em re-renders) não levanta erro.
- Os tipos `INTEGER PRIMARY KEY AUTOINCREMENT`, `TEXT NOT NULL` e `TEXT` (nullable) refletem um mapeamento direto com a interface `Contact`, onde `id` e campos obrigatórios são NOT NULL e opcionais são nullable no banco.
- Separar em duas chamadas `execSync` (em vez de uma string com ponto-e-vírgula) foi uma decisão deliberada para melhorar a legibilidade e facilitar adicionar novos PRAGMAs ou índices no futuro sem reescrever a query toda.
