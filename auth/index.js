require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = process.env.JWT_SECRET || 'segredo-chat';

// LowDB com FileSync (API ANTIGA - SÍNCRONA)
const adapter = new FileSync('users.json');
const db = low(adapter);

// estrutura inicial
db.defaults({ users: [] }).write();

// ROTAS

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  const exists = db.get('users')
    .find({ username })
    .value();

  if (exists) {
    return res.status(400).json({ error: 'Usuário já existe' });
  }

  const hash = await bcrypt.hash(password, 10);

  db.get('users')
    .push({ username, password: hash })
    .write();

  res.status(201).json({ username });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  const user = db.get('users')
    .find({ username })
    .value();

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ token, username });
});

app.listen(3001, () => {
  console.log('Auth rodando na porta 3001');
});
