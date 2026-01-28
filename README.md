# 📱 Sistema de Denúncias — React Native + Node.js + RabbitMQ

Sistema completo de **cadastro de denúncias**, composto por:

- 📱 **Aplicação Mobile** (React Native + Expo)
- 🌐 **Backend REST API** (Node.js + Express)
- 🗄️ **Banco de dados SQL** (MySQL + Prisma)
- 🐇 **Fila de mensagens** (RabbitMQ)
- 📄 **Documentação da API** (Swagger)

O projeto foi desenvolvido com foco em **arquitetura organizada**, **resiliência**, **offline-first no mobile** e **boas práticas de backend**.

---

## 🎯 Objetivo do Projeto

Criar um sistema que permita:

- Cadastro de denúncias pelo aplicativo
- Funcionamento **offline** no mobile
- Persistência local e sincronização com backend
- Processamento assíncrono de denúncias via fila
- API segura com autenticação JWT
- Documentação clara e testável da API

---

## 🧠 Visão Geral da Arquitetura

### 📱 Mobile (Offline-First)
- O app funciona mesmo sem internet
- Dados são salvos localmente
- Comunicação com API quando disponível

### 🌐 Backend
- API REST com Express
- Autenticação via JWT
- CRUD completo de denúncias
- Persistência em banco SQL com Prisma

### 🐇 RabbitMQ
- Backend consome denúncias via fila
- Validação e normalização dos dados
- Salvamento no banco de dados
- ACK/NACK com controle de erros
- API não cai se a fila estiver indisponível

---

## 🚀 Tecnologias Utilizadas

### 📱 Mobile
- **React Native**
- **Expo**
- **Expo Router**
- **SQLite (expo-sqlite)**
- **JavaScript**

### 🌐 Backend
- **Node.js**
- **Express**
- **Prisma ORM**
- **MySQL**
- **JWT (jsonwebtoken)**
- **Zod (validações)**
- **Swagger (swagger-ui-express, swagger-jsdoc)**

### 🐇 Mensageria / Infra
- **RabbitMQ**
- **Docker**
- **Docker Compose**

---

## 🧩 Funcionalidades

### 📱 Aplicação Mobile
- Login com autenticação JWT
- Cadastro de denúncias
- Validações completas de formulário:
  - Nome completo
  - CPF com dígitos verificadores
  - Idade válida
  - Sexo obrigatório
  - CEP válido
- Persistência local (SQLite)
- Listagem de denúncias
- Exclusão de registros
- Funcionamento offline

---

### 🌐 Backend (API)
- `POST /auth/login` — autenticação
- `GET /denuncias` — listar denúncias (JWT)
- `POST /denuncias` — criar denúncia (JWT)
- `PUT /denuncias/:id` — atualizar
- `DELETE /denuncias/:id` — deletar
- `GET /health` — healthcheck da API e banco

---

### 🐇 RabbitMQ
- Consumer escutando fila `denuncias`
- Validação de mensagens
- Normalização de dados (`localizacao` ou campos diretos)
- Salvamento no banco via Prisma
- ACK em sucesso
- NACK em erro (com requeue quando necessário)
- Retry com backoff
- Logs estruturados

---

## 📄 Documentação da API (Swagger)

A API possui documentação interativa com Swagger:

📍 **URL:(http://localhost:3333/docs)**  

É possível:
- Visualizar todas as rotas
- Ver schemas de request/response
- Autenticar com JWT
- Testar endpoints direto pelo navegador

---

## 📁 Estrutura do Projeto

```text
denuncias-react-native/
├─ app/                 # Aplicação Mobile (Expo)
├─ backend/
│  ├─ prisma/           # Schema e migrations
│  ├─ src/
│  │  ├─ middlewares/   # Auth JWT
│  │  ├─ rabbitmq/      # Connection, consumer, handler
│  │  ├─ routes/        # Rotas da API
│  │  ├─ prisma.js      # Prisma Client
│  │  ├─ swagger.js     # Documentação Swagger
│  │  └─ server.js      # Inicialização da API
│  ├─ docker-compose.yml
│  └─ package.json
└─ README.md
```

---

## ⚙️ Como Rodar o Projeto

### 🔧 Pré-requisitos:

- Node.js instalado
- Docker e Docker Compose
- Expo Go instalado no celular (Android ou iOS)

### 🐇 Subir Infra (MySQL + RabbitMQ)

- Dentro da pasta backend, execute:
```bash
docker compose up -d
```
Isso irá subir:
- Banco de dados MySQL
- Broker de mensagens RabbitMQ

### Painel do RabbitMQ:
```bash
http://localhost:15672
```
- Usuário: guest
- Senha: guest

### 🌐 Rodar Backend
```bash
cd backend
npm install
npm run dev
```

A API ficará disponível em:
```bash
http://localhost:3333
```
Documentação Swagger:
```bash
http://localhost:3333/docs
```

### 📱 Rodar Mobile:
Na raiz do projeto:
```bash
npm install
npx expo start
Abra o Expo Go
```
- Escaneie o QR Code

- Teste o aplicativo no celular

✅ Recomendado testar no celular, pois o SQLite local funciona melhor em ambiente mobile.

---

## 🧪 Checklist de Testes

- Fazer login com credenciais válidas
- Criar denúncia pelo aplicativo
- Validar erros de formulário:
  - Nome inválido
  - CPF inválido
  - Idade inválida
  - Sexo não selecionado
  - CEP inválido
- Ver denúncia listada
- Apagar denúncia
- Enviar denúncia via RabbitMQ
- Confirmar salvamento no banco de dados
- Acessar documentação Swagger (`/docs`)
- Testar rota `/health`

---

## 📌 Autor

**Bryan Duarte**

Projeto desenvolvido para **estudo**, **aprendizado de arquitetura fullstack** e **demonstração de habilidades** em desenvolvimento mobile, backend, mensageria e documentação de APIs.

