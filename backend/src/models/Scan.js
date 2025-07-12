const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

// Modèle Scan - Stockage des résultats des analyses CheckPhish et Email
const Scan = sequelize.define('Scan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: true  // URL analysée (nullable pour les scans d'email)
  },
  emailContent: {
    type: DataTypes.TEXT,
    allowNull: true  // Contenu de l'email analysé
  },
  jobId: {
    type: DataTypes.STRING(255),
    allowNull: true,  // Nullable pour les scans d'email
    unique: true      // ID unique du job CheckPhish
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    defaultValue: 'pending'  // Statut du scan
  },
  disposition: {
    type: DataTypes.ENUM('phish', 'phishing', 'safe', 'clean', 'unknown'),
    allowNull: true   // Résultat de l'analyse
  },
  brand: {
    type: DataTypes.STRING(100),
    allowNull: true   // Marque ciblée par le phishing
  },
  insights: {
    type: DataTypes.TEXT,
    allowNull: true   // Lien vers les insights CheckPhish ou insights email
  },
  screenshotPath: {
    type: DataTypes.TEXT,
    allowNull: true   // Chemin vers la capture d'écran
  },
  resolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false  // URL résolue ou non
  },
  scanStartTs: {
    type: DataTypes.BIGINT,
    allowNull: true   // Timestamp de début du scan
  },
  scanEndTs: {
    type: DataTypes.BIGINT,
    allowNull: true   // Timestamp de fin du scan
  },
  categories: {
    type: DataTypes.JSON,
    allowNull: true   // Catégories de détection CheckPhish
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true   // Message d'erreur si échec
  }
}, {
  tableName: 'scans',
  timestamps: true
});

// Relations entre les modèles
Scan.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Scan, { foreignKey: 'userId', as: 'scans' });

// Méthodes statiques pour les requêtes courantes
Scan.findByUserId = async function(userId) {
  return await this.findAll({
    where: { userId },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
    order: [['createdAt', 'DESC']]
  });
};

Scan.findByJobId = async function(jobId) {
  return await this.findOne({ where: { jobId } });
};

module.exports = Scan; 