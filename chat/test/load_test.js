const fetch = require("node-fetch");
const io = require("socket.io-client");

const AUTH_URL = "http://localhost:3001";
const CHAT_URL = "http://localhost:3002";

const USERS = 10;
const PASSWORD = "123";

async function login(username) {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password: PASSWORD })
  });
  const json = await res.json();
  return json.token;
}

(async () => {
  console.log(`Iniciando teste de carga com ${USERS} usuários...`);

  const sockets = [];
  let received = 0;

  for (let i = 0; i < USERS; i++) {
    const username = `load_user_${i}`;

    // registra usuário (ignora erro se já existir)
    await fetch(`${AUTH_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password: PASSWORD })
    }).catch(() => {});

    const token = await login(username);

    const socket = io(CHAT_URL, {
      auth: { token }
    });

    socket.on("connect", () => {
      socket.emit("private_message", {
        to: username,
        message: `msg from ${username}`
      });
    });

    socket.on("private_message", () => {
      received++;
      if (received === USERS) {
        console.log("✅ Todas as mensagens recebidas com sucesso");
        process.exit(0);
      }
    });

    sockets.push(socket);
  }

  setTimeout(() => {
    console.error("❌ Timeout — nem todas mensagens foram entregues");
    process.exit(1);
  }, 10000);
})();
