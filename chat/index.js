require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const db2 = new sqlite3.Database('./chat.db');
db2.serialize(() => {
  db2.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender TEXT,
      receiver TEXT,
      message TEXT,
      timestamp INTEGER
    )
  `);
});


const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

const adapter = new FileSync('messages.json');
const db = low(adapter);

// estrutura inicial
db.defaults({ messages: [] }).write();

const users = new Map();
const SECRET = process.env.JWT_SECRET || 'segredo-chat';

// middleware de autenticação socket
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Token ausente'));

  try {
    const decoded = jwt.verify(token, SECRET);
    socket.username = decoded.username;
    users.set(decoded.username, socket.id);
    next();
  } catch {
    next(new Error('Token inválido'));
  }
});

io.on('connection', socket => {
  console.log('Conectado:', socket.username);

  socket.on('private_message', ({ to, message }) => {
    const msg = {
      from: socket.username,
      to,
      message,
      timestamp: Date.now()
    };

    db2.run(
      `INSERT INTO messages (sender, receiver, message, timestamp)
      VALUES (?, ?, ?, ?)`,
      [msg.from, msg.to, msg.message, msg.timestamp]
    );

    const targetSocket = users.get(to);
    if (targetSocket) {
      io.to(targetSocket).emit('private_message', msg);
    }

    socket.emit('private_message', msg);
  });

  socket.on('disconnect', () => {
  if (users.get(socket.username) === socket.id) {
    users.delete(socket.username);
  }
});
});

app.get('/messages', (req, res) => {
  db2.all("SELECT * FROM messages ORDER BY timestamp ASC", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

server.listen(3002, () => {
  console.log('Chat rodando na porta 3002');
});

