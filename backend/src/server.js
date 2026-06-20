require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.set('trust proxy', true);
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false
}));
app.use(cors({ origin: process.env.FRONTEND_URL || true, credentials: true }));

if (process.env.VERCEL === '1') {
  const rawBodyMiddleware = (req, res, next) => {
    if (req.method === 'GET' || req.method === 'HEAD') return next();
    const ct = req.headers['content-type'] || '';
    if (!ct.includes('application/json')) return next();
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      if (data) {
        try { req.body = JSON.parse(data); req._body = true; }
        catch (e) { return res.status(400).json({ message: 'Invalid JSON in request body' }); }
      }
      next();
    });
    req.on('error', () => next());
  };
  app.use(rawBodyMiddleware);
} else {
  app.use(express.json({ limit: '1mb' }));
}
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  next();
});

connectDB().catch(e => console.error('Initial DB connection failed:', e.message));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many login attempts, please try again later' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Too many requests, please try again later' }
});
app.use('/api', limiter);

const apiMiddleware = async (req, res, next) => {
  if (req.path === '/health') return next();
  try {
    const db = await Promise.race([
      connectDB(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB connection timeout')), 12000))
    ]);
    if (!db) {
      return res.status(503).json({ message: 'Database connection unavailable - check MongoDB Atlas Network Access' });
    }
  } catch (err) {
    console.error('DB middleware error:', err.message);
    return res.status(503).json({ message: 'Database connection unavailable - check MongoDB Atlas Network Access' });
  }
  next();
};

app.use('/api', apiMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TaskEarn Pro API is running' });
});

const frontendPath = path.join(__dirname, '../../frontend/out');
app.use(express.static(frontendPath, {
  maxAge: '1y',
  immutable: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
    if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
  }
}));
app.get('*', (req, res) => {
  if (!req.accepts('html')) return res.status(404).json({ message: 'Not found' });
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
