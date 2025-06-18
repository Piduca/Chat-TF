const socket = io();
const nome = localStorage.getItem('nome');
const sala = localStorage.getItem('sala');

if (!nome || !sala) {
  window.location.href = "index.html";
}

socket.emit('entrarNaSala', { nome, sala });

function enviarMensagem() {
  const msg = document.getElementById('mensagem').value;
  socket.emit('mensagem', { sala, nome, texto: msg });
  document.getElementById('mensagem').value = '';
}

socket.on('mensagem', (msg) => {
  if (msg.nome === nome) {
    adicionarMensagem(`Você: ${msg.texto}`, msg.hora);
  } else {
    adicionarMensagem(`${msg.nome}: ${msg.texto}`, msg.hora);
  }
});

socket.on('imagem', (msg) => {
  if (msg.nome === nome) {
    adicionarImagem("Você", msg.dataURL, msg.hora);
  } else {
    adicionarImagem(msg.nome, msg.dataURL, msg.hora);
  }
});

socket.on('usuarioEntrou', (nome) => {
  const chat = document.getElementById('chat');
  const p = document.createElement('p');
  p.style.color = 'green';
  p.style.fontStyle = 'italic';
  p.textContent = `${nome} entrou na sala`;
  chat.appendChild(p);
});

socket.on('arquivo', ({ nome: remetente, nomeOriginal, caminho, hora }) => {
  const chat = document.getElementById('chat');
  const p = document.createElement('p');
  const ehUsuario = remetente === nome;

  p.innerHTML = `<strong>${ehUsuario ? "Você" : remetente}</strong> enviou: 
    <a href="${caminho}" download style="color:blue;">${nomeOriginal}</a> 
    <span style="color:gray;">[${hora}]</span>`;
  chat.appendChild(p);
});

document.getElementById('uploadInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  if (!file) return;

  reader.onload = function () {
    const base64 = reader.result.split(',')[1];
    const tipo = file.type;

    if (tipo.startsWith('image/')) {
      socket.emit('imagem', {
        sala,
        nome,
        dataURL: reader.result,
      });
    } else {
      socket.emit('arquivo', {
        sala,
        nome,
        fileName: file.name,
        fileData: base64,
      });
    }
  };

  reader.readAsDataURL(file);
});

function adicionarMensagem(texto, hora = '') {
  const chat = document.getElementById('chat');
  const p = document.createElement('p');
  p.innerHTML = `${texto} <span style="color:gray; font-size:0.9em;">[${hora}]</span>`;
  chat.appendChild(p);
}

function adicionarImagem(nome, src, hora = '') {
  const chat = document.getElementById('chat');
  const p = document.createElement('p');
  p.innerHTML = `<strong>${nome}</strong>: <span style="color:gray; font-size:0.9em;">[${hora}]</span>`;
  const img = document.createElement('img');
  img.src = src;
  img.width = 200;
  chat.appendChild(p);
  chat.appendChild(img);
  chat.appendChild(document.createElement('br'));
}

function sairDaSala() {
  socket.emit('usuarioSaiu', { nome, sala });
  localStorage.removeItem('nome');
  localStorage.removeItem('sala');
  window.location.href = "index.html";
}

let inatividadeTimer = null;
function resetarInatividade() {
  clearTimeout(inatividadeTimer);
  inatividadeTimer = setTimeout(() => {
    alert("Você foi desconectado por inatividade.");
    localStorage.clear();
    window.location.href = "index.html";
  }, 5 * 60 * 1000);
}
['mousemove', 'keydown', 'click'].forEach(evt =>
  document.addEventListener(evt, resetarInatividade)
);
resetarInatividade();
