const { Sequelize } = require('sequelize');

// Configuration de la base de données MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'phishtracer',        // Nom de la base de données
  process.env.DB_USER || 'root',               // Nom d'utilisateur MySQL
  process.env.DB_PASSWORD || '',               // Mot de passe MySQL
  {
    host: process.env.DB_HOST || 'localhost',  // Hôte de la base de données
    port: process.env.DB_PORT || 3306,         // Port MySQL par défaut
    dialect: 'mysql',                          // Type de base de données
    logging: process.env.NODE_ENV === 'development' ? console.log : false, // Logs en développement uniquement
    pool: {
      max: 5,                                  // Nombre maximum de connexions
      min: 0,                                  // Nombre minimum de connexions
      acquire: 30000,                          // Temps d'acquisition d'une connexion (30s)
      idle: 10000                              // Temps d'inactivité avant fermeture (10s)
    }
  }
);

// Test de connexion à la base de données
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion MySQL établie avec succès.');
  } catch (error) {
    console.error('❌ Impossible de se connecter à MySQL:', error);
  }
};

module.exports = { sequelize, testConnection }; 