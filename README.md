Chat em Tempo Real com Imagens e Arquivos — Socket.IO + Node.js

Este projeto é um **sistema de chat distribuído** com suporte a:

- Múltiplas salas protegidas por senha
- Envio de arquivos (PDF, Word, ZIP etc.)
- Envio e exibição de imagens
- Comunicação em tempo real com Socket.IO
- Salvamento de arquivos no servidor
- Login, logout e autenticação com PostgreSQL
- Log persistente das conversas

---

## Tecnologias utilizadas

- **Node.js**
- **Express.js**
- **Socket.IO**
- **PostgreSQL**
- **HTML/CSS/JS (frontend puro)**
- **UUID / fs / path** (para salvar arquivos)

---

## Como rodar o projeto
 Pré-requisitos:
- Node.js instalado
- PostgreSQL rodando localmente
- Git (opcional)

1. Clone o repositório
git clone https://github.com/seu-usuario/chat-socketio-distribuido.git
cd chat-socketio-distribuido

2. Instale as depedências:
npm install

3. Upe a base dados chat no postgresql e altere no server.js os dados para os que correspondem ao seu sistema

4. Rode no servidor
node server.js

5. Para acessar noutro computador na mesma rede:
Digite http://<ip-do-seu-computador>:3000

Estruture o projeto desse jeito:
├── public/               (index.html, chat.html, client.js)
├── imagens/             
├── uploads/
├── conversas.log
├── server.js
├── README.md

