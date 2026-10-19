const crypto = require('node:crypto');
const path = require('node:path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET debe configurarse con al menos 32 caracteres. Copia .env.example a .env.');
}

const port = Number(process.env.PORT || 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT debe ser un numero entero entre 1 y 65535.');
}

function encodeBase64Url(value) {
  return Buffer.from(value).toString('base64url');
}

function createToken(subject) {
  const header = encodeBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = encodeBase64Url(JSON.stringify({
    sub: subject,
    exp: Math.floor(Date.now() / 1000) + 3600
  }));
  const content = `${header}.${payload}`;
  const signature = crypto.createHmac('sha256', jwtSecret).update(content).digest('base64url');
  return `${content}.${signature}`;
}

function isValidToken(token) {
  const parts = token.split('.');

  if (parts.length !== 3) {
    return false;
  }

  const content = `${parts[0]}.${parts[1]}`;
  const expected = crypto.createHmac('sha256', jwtSecret).update(content).digest();
  let actual;

  try {
    actual = Buffer.from(parts[2], 'base64url');
  } catch {
    return false;
  }

  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    return typeof payload.sub === 'string' &&
      typeof payload.exp === 'number' &&
      payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function requireToken(req, res, next) {
  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!match || !isValidToken(match[1])) {
    return res.status(401).json({ error: 'Token de autenticacion invalido o ausente.' });
  }

  return next();
}

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.resolve(__dirname, '..', 'frontend')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (typeof username !== 'string' || !username.trim() ||
      typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'Se requieren usuario y contrasena.' });
  }

  return res.status(200).json({ token: createToken(username.trim()) });
});

app.get('/cartelera', requireToken, (req, res) => {
  res.json([
    { id: 'muestra-1', titulo: 'Pelicula de muestra' }
  ]);
});

app.get('/asientos/disponibles', (req, res) => {
  res.json([{ id: 'A1', disponible: true }]);
});

app.post('/reserva', requireToken, (req, res) => {
  const { cardNumber } = req.body || {};

  if (typeof cardNumber !== 'string' || !cardNumber.trim()) {
    return res.status(400).json({ error: 'Se requiere una tarjeta de prueba.' });
  }

  return res.status(402).json({ error: 'Pago rechazado: tarjeta de prueba invalida.' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`CineFlex disponible en http://localhost:${port}`);
  });
}

module.exports = app;
