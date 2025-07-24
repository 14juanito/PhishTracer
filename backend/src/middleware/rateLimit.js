const rateLimit = require('express-rate-limit');

// Rate limit général pour l'API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: {
    success: false,
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit spécifique pour l'authentification
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limite chaque IP à 5 tentatives de connexion par fenêtre
  message: {
    success: false,
    message: 'Trop de tentatives de connexion, veuillez réessayer plus tard'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit pour les scans
const scanLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limite chaque utilisateur à 10 scans par minute
  message: {
    success: false,
    message: 'Trop de scans demandés, veuillez attendre avant de réessayer'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Utiliser l'ID utilisateur si connecté, sinon l'IP
    return req.user ? req.user.id : req.ip;
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  scanLimiter
}; 