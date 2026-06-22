# MAPEAMENTO.md — Hierarquia de Componentes e Arquivos

## Árvore de Componentes

```
App
└── NavigationContainer                     (react-navigation)
    └── Stack.Navigator                     (3 telas em pilha)
        │
        ├── ContactsListScreen              src/screens/ContactsListScreen.tsx
        │   ├── Header
        │   │   ├── Título "Contatos"       (headerTitleStyle do Stack)
        │   │   └── Botão "+"               (headerRight via navigation.setOptions)
        │   ├── View > TextInput            (barra de busca local)
        │   └── FlatList
        │       └── ContactCard             src/components/ContactCard.tsx (reutilizável)
        │           ├── Avatar              src/components/Avatar.tsx
        │           ├── Text (nome)
        │           └── Text (telefone)
        │
        ├── ContactDetailsScreen            src/screens/ContactDetailsScreen.tsx
        │   ├── ScrollView
        │   │   ├── View (cabeçalho)
        │   │   │   ├── Avatar              src/components/Avatar.tsx
        │   │   │   └── Text (nome)
        │   │   ├── View "card"
        │   │   │   ├── LinhaInfo (Telefone)
        │   │   │   ├── LinhaInfo (E-mail)   (condicional)
        │   │   │   └── LinhaInfo (Aniversário) (condicional)
        │   │   └── View "acoes"
        │   │       ├── PrimaryButton "Editar"    src/components/PrimaryButton.tsx
        │   │       └── PrimaryButton "Excluir"   (variante destructive)
        │   └── Alert nativo                (confirmação de exclusão)
        │
        └── ContactFormScreen               src/screens/ContactFormScreen.tsx
            ├── KeyboardAvoidingView
            │   └── ScrollView
            │       ├── InputField (Nome *)     src/components/InputField.tsx
            │       ├── InputField (Telefone *) (com validação)
            │       ├── InputField (E-mail)
            │       └── InputField (Aniversário)
            └── View "rodapé" (fixo)
                └── PrimaryButton "Salvar"  src/components/PrimaryButton.tsx
```

---

## Estrutura de Arquivos

```
appagendacontatos/
├── App.tsx                         Raiz: NavigationContainer + Stack.Navigator + initDatabase
├── app.json                        Configuração Expo (nome, slug, plugins)
├── package.json                    Dependências npm
├── tsconfig.json                   Configuração TypeScript (estende expo/tsconfig.base)
├── babel.config.js                 Babel com preset expo
│
└── src/
    ├── types.ts                    RootStackParamList (tipagem das rotas)
    │
    ├── models/
    │   └── Contact.ts              Interface Contact { id, name, phone, email?, birthday? }
    │
    ├── database/
    │   └── database.ts             SQLite: initDatabase, getAllContacts, insertContact,
    │                               updateContact, deleteContact
    │
    ├── components/
    │   ├── Avatar.tsx              Círculo com iniciais; cor determinística pelo nome
    │   ├── ContactCard.tsx         Card da listagem (Avatar + nome + telefone + chevron)
    │   ├── InputField.tsx          Input com label, placeholder e mensagem de erro inline
    │   └── PrimaryButton.tsx       Botão reutilizável (primário azul / destrutivo vermelho)
    │
    └── screens/
        ├── ContactsListScreen.tsx  Lista + busca + estado vazio + botão novo contato
        ├── ContactDetailsScreen.tsx Detalhes + editar + excluir com confirmação
        └── ContactFormScreen.tsx   Formulário unificado cadastro/edição + validação

```

---

## Fluxo de Navegação

```
ContactsListScreen
    │
    ├──[toca no card]──► ContactDetailsScreen
    │                         │
    │                         ├──[Editar]──► ContactFormScreen (contact preenchido)
    │                         │                  └──[Salvar]──► goBack ──► ContactDetails*
    │                         │
    │                         └──[Excluir + confirmar]──► goBack ──► ContactsList
    │
    └──[botão "+"]──► ContactFormScreen (sem contact)
                          └──[Salvar]──► goBack ──► ContactsList
```

> *Nota: após editar, a tela de Detalhes ainda exibe os dados antigos (recebidos por `route.params`). Para ver os dados atualizados, o usuário volta para a lista e reabre o contato. Uma melhoria futura seria usar `navigation.navigate` com params atualizados em vez de `goBack`.
