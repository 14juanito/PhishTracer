const logger = (req, res, next) => {
  const start = Date.now();
  
  // Log de la requête entrante
  console.log(`📥 ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  
  // Intercepter la réponse pour logger les détails
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    
    // Log de la réponse
    const statusColor = res.statusCode >= 400 ? '🔴' : res.statusCode >= 300 ? '🟡' : '🟢';
    console.log(`${statusColor} ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    
    // Log des erreurs
    if (res.statusCode >= 400) {
      console.error(`❌ Erreur API: ${req.method} ${req.originalUrl}`, {
        statusCode: res.statusCode,
        duration,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        userId: req.user?.id || 'non connecté'
      });
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = logger; 