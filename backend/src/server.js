const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config/config');
const { testConnection } = require('./config/database');
const { initDatabase } = require('./config/initDatabase');
const { apiLimiter } = require('./middleware/rateLimit');
const logger = require('./middleware/logger');

// Route files
const auth = require('./routes/auth');
const scans = require('./routes/scans');
const admin = require('./routes/admin');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:3000'],
  credentials: true
}));

// Apply logging middleware
app.use(logger);

// Apply rate limiting to all routes
app.use(apiLimiter);

// Mount routers
app.use('/api/auth', auth);
app.use('/api/scans', scans);
app.use('/api/admin', admin);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API PhishTracer fonctionne correctement',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: 'Connected',
    timestamp: new Date().toISOString()
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur l\'API PhishTracer',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      scans: '/api/scans',
      admin: '/api/admin',
      test: '/api/test',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trouvée`,
    availableEndpoints: {
      auth: '/api/auth',
      scans: '/api/scans',
      admin: '/api/admin',
      test: '/api/test',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Erreur API:', err);
  
  // Validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: message
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }

  // JWT expired
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expiré'
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Connect to MySQL and start server
const startServer = async () => {
  try {
    // Test MySQL connection
    await testConnection();
    
    // Initialize database (create tables if they don't exist)
    await initDatabase();
    
    const PORT = config.PORT;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📊 Base de données MySQL connectée`);
      console.log(`🔗 API disponible sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur de démarrage du serveur:', err);
    process.exit(1);
  }
};

startServer(); 