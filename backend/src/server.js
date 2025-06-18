const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config/config');
const { db } = require('./config/firebase');

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
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
  credentials: true
}));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/scans', scans);
app.use('/api/admin', admin);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API PhishTracer' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Connect to Firebase and start server
const startServer = async () => {
  try {
    // Test Firebase connection
    await db.collection('test').doc('test').set({ test: true });
    console.log('Connecté à Firebase');
    
    const PORT = config.PORT;
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (err) {
    console.error('Erreur de connexion à Firebase:', err);
    process.exit(1);
  }
};

startServer(); 