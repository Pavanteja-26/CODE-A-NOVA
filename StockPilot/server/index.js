const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/products',  require('./routes/products'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/sales',     require('./routes/sales'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/dashboard', require('./routes/dashboard'));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: 'StockPilot API is running' }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ── Database & Server start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

async function startServer() {
  let mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri || mongoUri.includes('<username>')) {
    console.log('⚠️ No valid MONGO_URI found in environment. Falling back to in-memory MongoDB for testing.');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;
