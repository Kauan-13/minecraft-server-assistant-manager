## Visão Geral

Esta aplicação é uma reimplementação de um frontend React utilizando a biblioteca de componentes shadcn/ui, com foco em melhorar a experiência do usuário, consistência visual e feedback de ações críticas.

Além da modernização da interface, o projeto adiciona funcionalidades importantes que não existiam na versão anterior, como:

* Confirmação antes de iniciar ou parar servidores;
* Suporte a tema claro e escuro;
* Avatares de usuários conectados ao servidor;
* Notificações toaster para erros e feedback de ações.

---

## Funcionalidades

### Interface Moderna

* Reimplementação completa da interface em React;
* Componentes reutilizáveis com shadcn/ui;
* Layout responsivo;
* Melhor padronização visual.

### Confirmação de Ações Críticas

Antes de iniciar ou parar um servidor, a aplicação exibe um diálogo de confirmação para evitar ações acidentais.

### Tema Claro/Escuro

A aplicação possui suporte completo para:

* Tema claro;
* Tema escuro;
* Alternância dinâmica de tema;
* Persistência da preferência do usuário.

### Avatares de Usuários

Exibe os avatares dos usuários atualmente conectados ao servidor, facilitando identificação visual e melhorando a experiência colaborativa.

### Notificações Toaster

Sistema de notificações para:

* Erros de requisição;
* Falhas ao iniciar/parar servidor.

---

# Tecnologias Utilizadas

* React;
* TypeScript;
* Tailwind CSS;
* shadcn/ui;
* Radix UI;
* Lucide Icons;
* React Icons;

---

# Estrutura do Projeto

```bash
.
└── src
    └── components
        ├── AuthorizationDialog     # Diálogo de Autorização com Token
        ├── Header                  # Componente de Header
        │   ├── DrawerOptions       # Opções de Repositório de Tema para Mobile
        │   └── OptionButtons       # Opções de Repositório e Tema para Desktop
        ├── ServerCard              # Cards de Servidores
        ├── ServerCardSection       # Grid com os Cards de Servidores
        ├── ServerPlayersAvatar     # Componente com os Avatares de Jogos
        ├── ServerStateButton       # Botões de START, STARTING, STOP e STOPPING para os Servidores
        └── ui                      # Componentes do Shadcn
```
