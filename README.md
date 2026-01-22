# 📱 Sistema de Denúncias (Offline-First) — React Native + Expo + SQLite

Aplicação mobile desenvolvida com **React Native (Expo)** para **cadastro e listagem de denúncias**, com armazenamento **local** usando **SQLite**, garantindo funcionamento **offline-first** (mesmo sem internet).

---

## ✅ Objetivo do Projeto

Criar um app com:

- **Tela inicial** com navegação
- **Formulário completo** com validações
- **Listagem de registros** salvos
- **Persistência local (SQLite)**
- **Exclusão de registros**
- Estrutura organizada e código limpo

---

## 🚀 Tecnologias Utilizadas

- **React Native**
- **Expo**
- **Expo Router**
- **SQLite (expo-sqlite)**
- **JavaScript**
- **Node.js**

---

## 🧩 Funcionalidades

### 📌 Tela Inicial

- Botão **Criar denúncia** → abre o formulário
- Botão **Ver denúncias** → abre a listagem

### 📝 Formulário (Form)

Campos:

- Nome completo
- CPF
- Idade
- Sexo (Masculino/Feminino)
- Localização (agrupada):
  - Endereço
  - CEP
  - Complemento (opcional)

Validações:

- ✅ Nome com **pelo menos 2 palavras**
- ✅ CPF com **validação real (dígitos verificadores)** + bloqueio de CPFs repetidos
- ✅ Idade **somente números** (intervalo válido)
- ✅ Sexo obrigatório
- ✅ CEP com **8 dígitos** + bloqueio de sequências repetidas (ex.: `00000000`)

Ao enviar:

- Salva no SQLite
- Mostra alert de sucesso
- Redireciona para a listagem

### 📋 Listagem (List)

- Carrega registros do SQLite
- Mostra dados completos
- Botão **Apagar** com confirmação
- Atualiza automaticamente ao voltar do formulário

---

## 📁 Estrutura de Pastas

denuncias-react-native/
├─ app/
│ ├─ layout.tsx
│ ├─ form.js
│ ├─ index.js
│ └─ list.js
├─ src/
│ ├─ database/
│ │ └─ database.js
│ └─ utils/
│ └─ validators.js
└─ README.md

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos

- Node.js instalado
- Expo Go instalado no celular

### Instalar dependências

```bash
npm install
```

---

## Rodando o Projeto

- npx expo start
- Abra o Expo Go
- Escaneie o QR Code
- Teste o app no celular
- ✅ Recomendado: testar no celular, pois o SQLite local funciona melhor no ambiente mobile.

---

## 🧪 Como Testar (Checklist)

- Criar denúncia com dados válidos → deve salvar e aparecer na lista
- Testar validações:
- Nome com 1 palavra → erro
- CPF inválido → erro
- Idade vazia ou inválida → erro
- Sexo não selecionado → erro
- CEP inválido ou repetido → erro
- Apagar denúncia → deve remover da lista
- Fechar o app e abrir novamente → os dados devem permanecer salvos (SQLite)

---

## 📌 Autor

### Bryan Duarte

- Projeto desenvolvido para estudo e demonstração de habilidades em desenvolvimento mobile com persistência offline

---
