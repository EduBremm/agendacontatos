# ESTADO.md — Gerenciamento de Estado

## Tabela de Estado Global

| Dado | Local | Como atualiza |
|---|---|---|
| Lista de contatos | `useState<Contact[]>` em `ContactsListScreen` | Recarrega do SQLite via `getAllContacts()` ao focar a tela (`useFocusEffect`) |
| Contato selecionado | `route.params.contact` em `ContactDetails` | Passado ao navegar da listagem via `navigation.navigate('ContactDetails', { contact })` |
| Campos do formulário | 4x `useState<string>` em `ContactFormScreen` | `onChangeText` de cada `InputField` |
| Erros de validação | `useState<ErrosFormulario>` em `ContactFormScreen` | Setados ao tentar salvar; limpos individualmente ao editar o campo com erro |
| Loading do salvar | `useState<boolean>` em `ContactFormScreen` | `true` antes da operação no banco, `false` no `finally` |
| Texto de busca | `useState<string>` em `ContactsListScreen` | `onChangeText` do TextInput de busca |

---

## Diagrama de Fluxo de Estado

```
SQLite (fonte de verdade)
    │
    │ getAllContacts()
    ▼
contacts: Contact[]          (ContactsListScreen)
    │
    │ filtro local (includes)
    ▼
contatosFiltrados: Contact[] (computado inline, sem estado extra)
    │
    │ FlatList renderItem
    ▼
ContactCard ──[onPress]──► navigation.navigate('ContactDetails', { contact })
                                │
                                │ route.params.contact
                                ▼
                           Exibe dados        (ContactDetailsScreen)
                                │
                                ├──[Editar]──► navigation.navigate('ContactForm', { contact })
                                │                   │
                                │                   │ Pré-popula useState com dados existentes
                                │                   │ updateContact() → navigation.goBack()
                                │                   │
                                │             useFocusEffect em ContactsList
                                │             recarrega getAllContacts() ✓
                                │
                                └──[Excluir]──► deleteContact(id) → navigation.goBack()
                                                    │
                                              useFocusEffect em ContactsList
                                              recarrega getAllContacts() ✓
```

---

## Decisões de Estado

**Por que não useState global / Context / Redux?**
O app tem fluxo linear simples (3 telas) sem necessidade de compartilhamento de estado entre galhos da árvore. `useFocusEffect` + SQLite como fonte de verdade é suficiente e mais simples de manter.

**Por que não useReducer no formulário?**
Com apenas 4 campos e 2 tipos de erro, o custo de legibilidade de um reducer supera o benefício. `useState` individual por campo mantém o código autoexplicativo.

**Por que recarregar do banco a cada foco em vez de atualizar o estado local?**
Garante consistência com o banco (fonte de verdade única) sem sincronização manual. O custo é mínimo: SQLite síncrono com poucos registros é instantâneo.
