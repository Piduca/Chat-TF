const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Chat',
  password: '.',
  port: 5432,
});

const imagensDir = path.join(__dirname, 'imagens');
if (!fs.existsSync(imagensDir)) fs.mkdirSync(imagensDir);

const logFile = path.join(__dirname, 'conversas.log');


function logMensagem(msg) {
  const data = new Date().toISOString();
  fs.appendFileSync(logFile, `[${data}] ${msg}\n`);
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

io.on('connection', (socket) => {
  let salaAtual = null;
  let nomeUsuario = null;

  socket.on('verificarOuCriarSala', async ({ sala, senha }) => {
  try {
    const result = await pool.query('SELECT senha FROM sala WHERE nome = $1', [sala]);

    if (result.rowCount === 0) {
      await pool.query('INSERT INTO sala (nome, senha) VALUES ($1, $2)', [sala, senha]);
      socket.emit('salaCriada');
    } else {
      const senhaCorreta = result.rows[0].senha;
      if (senhaCorreta === senha) {
        socket.emit('senhaValida');
      } else {
        socket.emit('senhaInvalida');
      }
    }
  } catch (error) {
    console.error('Erro ao verificar/criar sala:', error);
    socket.emit('senhaInvalida');
  }
  });

  socket.on('entrarNaSala', ({ nome, sala }) => {
  nomeUsuario = nome;
  salaAtual = sala;
  socket.join(sala);
  console.log(`${nome} entrou na sala ${sala}`);
  logMensagem(`${nome} entrou na sala ${sala}`);
  socket.to(sala).emit('usuarioEntrou', nome);
  });

  socket.on('mensagem', ({ nome, sala, texto }) => {
    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    io.to(sala).emit('mensagem', { nome, texto, hora });
    logMensagem(`${nome} (sala ${sala}): ${texto}`);
  });

  socket.on('imagem', ({ nome, sala, dataURL }) => {
    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const base64Data = dataURL.replace(/^data:image\/\w+;base64,/, '');
    const ext = dataURL.substring("data:image/".length, dataURL.indexOf(";base64"));
    const nomeImagem = `${uuidv4()}.${ext}`;
    const caminho = path.join(imagensDir, nomeImagem);
    fs.writeFileSync(caminho, base64Data, 'base64');
    logMensagem(`${nome} (sala ${sala}) enviou imagem: ${nomeImagem}`);
    io.to(sala).emit('imagem', { nome, dataURL, hora });
  });

  socket.on('arquivo', ({ nome, sala, fileName, fileData }) => {
  const ext = path.extname(fileName);
  const novoNome = `${uuidv4()}${ext}`;
  const caminho = path.join(__dirname, 'uploads', novoNome);

  fs.writeFileSync(caminho, Buffer.from(fileData, 'base64'));

  const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  io.to(sala).emit('arquivo', {
    nome,
    nomeOriginal: fileName,
    caminho: `/uploads/${novoNome}`,
    hora,
  });

  logMensagem(`${nome} enviou o arquivo ${fileName} (${novoNome})`);
  });

  socket.on('disconnect', () => {
    if (nomeUsuario && salaAtual) {
      logMensagem(`${nomeUsuario} saiu da sala ${salaAtual}`);
    }
  });

  socket.on('usuarioSaiu', ({ nome, sala }) => {
  logMensagem(`${nome} saiu da sala ${sala}`);
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Servidor rodando em http://0.0.0.0:3000');
});
