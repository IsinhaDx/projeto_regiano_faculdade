# Eventify

Sistema de gestão de eventos e participantes, desenvolvido como projeto acadêmico. Permite cadastrar eventos, inscrever participantes (com validação de CPF) e gerenciar tudo por trás de um login com autenticação.

## Tecnologias

**Backend** (`Eventify/server`)
- Node.js + Express + TypeScript
- SQLite (via `sqlite` + `sqlite3`)
- JWT para autenticação e `bcryptjs` para hash de senha

**Frontend** (`Eventify/client`)
- React + TypeScript
- Vite
- React Router

## Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 18 ou superior) — [baixar aqui](https://nodejs.org/)
- **npm** (já vem junto com o Node.js)
- **Git**

Para conferir se já tem tudo instalado, rode no terminal:

```bash
node -v
npm -v
git --version
```

## 1. Clonar o repositório

```bash
git clone https://github.com/IsinhaDx/projeto_regiano_faculdade.git
cd projeto_regiano_faculdade
git checkout feat/participant-register
cd Eventify
```

## 2. Rodar o backend (servidor)

Abra um terminal e execute:

```bash
cd server
npm install
```

Isso vai instalar todas as dependências do backend (pode demorar um pouco na primeira vez).

Em seguida, inicialize o banco de dados (cria as tabelas e alguns dados iniciais, como usuários e eventos de exemplo):

```bash
npm run db:init
```

Você deve ver a mensagem `Banco de dados inicializado/atualizado com sucesso.` no terminal. Esse comando é seguro de rodar mais de uma vez — ele não duplica dados que já existem.

Agora suba o servidor:

```bash
npm run dev
```

Se der tudo certo, vai aparecer:

```
Backend rodando na porta 3001
```

Deixe esse terminal aberto — é o backend rodando.

## 3. Rodar o frontend (interface)

Abra um **novo terminal** (sem fechar o do backend) e execute:

```bash
cd Eventify/client
npm install
npm run dev
```

O terminal vai mostrar um link parecido com `http://localhost:3000` — abra esse endereço no navegador.

## 4. Fazer login

O comando `db:init` já cria alguns usuários de teste que você pode usar para entrar:

| Email | Senha |
|---|---|
| admin@eventify.com | admin123 |
| gerente@eventify.com | gerente123 |
| operador@eventify.com | operador123 |

## Resumo dos comandos

```bash
# Terminal 1 - Backend
cd Eventify/server
npm install
npm run db:init
npm run dev

# Terminal 2 - Frontend
cd Eventify/client
npm install
npm run dev
```

## Problemas comuns

- **"Porta 3001/3000 já em uso"**: feche qualquer outro processo usando essas portas, ou finalize o terminal antigo que estava rodando o projeto.
- **Login não funciona / erro de credenciais**: confirme que rodou `npm run db:init` antes de tentar logar.
- **Erro ao instalar dependências**: apague a pasta `node_modules` e o arquivo `package-lock.json` da pasta (`server` ou `client`) e rode `npm install` novamente.
- **Tela em branco no frontend**: confira se o backend (terminal 1) está rodando antes de abrir a interface — o frontend depende da API em `http://localhost:3001`.
