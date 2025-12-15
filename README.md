# Chat Distribuído com Autenticação

## Descrição
Este projeto implementa um sistema de chat distribuído utilizando arquitetura
de microsserviços. O sistema é composto por dois serviços principais:
um serviço de autenticação (Auth) e um serviço de chat (Chat).

A autenticação é realizada por meio de tokens JWT, enquanto a troca de mensagens
ocorre em tempo real utilizando Socket.IO. As mensagens e usuários são
persistidos localmente utilizando LowDB.

---

## Arquitetura
- **Auth Service**: responsável pelo registro e login dos usuários, gerando
  tokens JWT.
- **Chat Service**: responsável pela comunicação em tempo real e troca de
  mensagens privadas entre usuários autenticados.
- **Frontend**: interface simples em HTML e JavaScript para interação com o sistema.

---

## Tecnologias Utilizadas
- Node.js
- Express
- Socket.IO
- JSON Web Token (JWT)
- LowDB
- HTML / JavaScript

---

## Como Executar o Projeto

### 1. Serviço de Autenticação (Auth)
cd auth
npm install
node index.js

O serviço será iniciado na porta 3001.

### 2. Serviço de Chat
cd chat
npm install
node index.js

O serviço será iniciado na porta 3002.

### 3. Frontend

Abra o arquivo abaixo diretamente no navegador:

frontend/index.html

### 4. Funcionalidades

-> Registro de usuários

-> Login com autenticação JWT

-> Comunicação em tempo real via Socket.IO

-> Envio de mensagens privadas entre usuários

-> Persistência de mensagens

-> Recuperação do histórico de mensagens

### 5. Observações

Este projeto foi desenvolvido com fins acadêmicos para a disciplina de
Sistemas Distribuídos, demonstrando conceitos como comunicação distribuída,
autenticação, persistência de dados e sistemas em tempo real.# chat-distribuido-sd
# chat-distribuido-sd
# chat-distribuido-sd
# chat-distribuido-sd
