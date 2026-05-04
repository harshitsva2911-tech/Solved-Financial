// Polyfill global crypto for Node 18 (required by mongodb driver)
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = require('crypto').webcrypto;
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const tls = require('tls');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

// Node 18 autoSelectFamily tries IPv6 which Atlas rejects with a TLS error — force IPv4.
const _tlsConnect = tls.connect;
tls.connect = function (options, ...rest) {
  if (options && typeof options === 'object') {
    delete options.autoSelectFamily;
    options.family = 4;
  }
  return _tlsConnect.call(this, options, ...rest);
};

// ─── MongoDB connection (cached across serverless warm invocations) ────────────

let connectionPromise = null;

function connectDB() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (connectionPromise) return connectionPromise;

  connectionPromise = mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  }).then(() => {
    console.log('MongoDB connected');
  }).catch((err) => {
    console.error('MongoDB connection error:', err.message);
    connectionPromise = null; // allow retry on next request
    throw err;
  });

  return connectionPromise;
}

// ─── App setup ───────────────────────────────────────────────────────────────

const app = express();

app.use(compression());

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' },
}));

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  // Local development
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile, server-to-server)
    if (!origin) return callback(null, true);
    // Allow explicitly listed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow CloudFront, Vercel preview, and amazonaws.com domains
    if (
      origin.endsWith('.cloudfront.net') ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.amazonaws.com')
    ) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '7d',
  etag: true,
}));

// Ensure DB is connected before any API route runs
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ message: 'Database unavailable. Please try again.' });
  }
});

// ─── Routes ──────────────────────────────────────────────────────────────────

app.use('/api/auth', require('./routes/auth'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/services', require('./routes/services'));
app.use('/api/team', require('./routes/team'));
app.use('/api/case-studies', require('./routes/caseStudies'));
app.use('/api/metrics', require('./routes/metrics'));
app.use('/api/logos', require('./routes/logos'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/jurisdictions', require('./routes/jurisdictions'));
app.use('/api/industries', require('./routes/industries'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/seed', require('./routes/seed'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ─── Start server ────────────────────────────────────────────────────────────

// On Vercel (serverless) the app is exported and Vercel handles listening.
// On EC2 / local, we start the HTTP server ourselves.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
    );
  }).catch((err) => {
    console.error('Failed to connect to DB on startup:', err.message);
    process.exit(1);
  });
}

module.exports = app;
