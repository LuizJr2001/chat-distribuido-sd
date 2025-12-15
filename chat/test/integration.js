const fetch = require("node-fetch");
const io = require("socket.io-client");

const AUTH_URL = "http://localhost:3001";
const CHAT_URL = "http://localhost:3002";

const USER = "integ-tester";
const PASS = "123";

(async () => {
  try {
    // 1) registrar usuário (ignora erro se já existir)
    await fetch(`${AUTH_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: USER, password: PASS })
    }).catch(() => {});

    // 2) login
    const res = await fetch(`${AUTH_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: USER, password: PASS })
    });

    const json = await res.json();
    if (!json.token) {
      console.error("❌ Login falhou", json);
      process.exit(1);
    }

    const token = json.token;
    console.log("✅ Login OK");

    // 3) conectar no chat com token
    const socket = io(CHAT_URL, {
      auth: { token }
    });

    socket.on("connect", () => {
      console.log("✅ Conectado ao chat");

      // 4) enviar mensagem privada para si mesmo
      socket.emit("private_message", {
        to: USER,
        message: "mensagem de teste " + Date.now()
      });
    });

    socket.on("private_message", (msg) => {
      // Ignorar mensagens que não foram enviadas por este usuário
      if (msg.from !== USER) return;

      console.log("📩 Recebeu:", msg);

      // Validar mensagem de teste
      if (
        (msg.to === USER || msg.to === null) &&
        msg.message.includes("mensagem de teste")
      ) {
        console.log("🎉 OK — teste de integração passou");
        process.exit(0);
      } else {
        console.error("❌ Mensagem inválida");
        process.exit(1);
      }
    });

    setTimeout(() => {
      console.error("⏱️ Timeout — nenhuma mensagem recebida");
      process.exit(1);
    }, 5000);

  } catch (err) {
    console.error("❌ Erro geral:", err);
    process.exit(1);
  }
})();
