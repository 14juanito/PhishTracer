const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

// Modèle User - Gestion des utilisateurs et administrateurs
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100]  // Nom entre 2 et 100 caractères
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,    // Email unique
    validate: {
      isEmail: true  // Validation format email
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255]  // Mot de passe entre 6 et 255 caractères
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true  // Utilisateur actif par défaut
  },
  lastLogin: {
    type: DataTypes.DATE  // Dernière connexion
  }
}, {
  tableName: 'users',
  timestamps: true,  // createdAt et updatedAt automatiques
  hooks: {
    // Hash du mot de passe avant sauvegarde
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Méthodes d'instance
User.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Méthodes statiques
User.findByEmail = async function(email) {
  return await this.findOne({ where: { email } });
};

User.findById = async function(id) {
  return await this.findByPk(id);
};

module.exports = User; 