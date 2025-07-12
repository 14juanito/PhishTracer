const { sequelize } = require('./database');
const { updateDatabase } = require('./updateDatabase');
const User = require('../models/User');
const Scan = require('../models/Scan');

// Fonction d'initialisation de la base de données
const initDatabase = async () => {
  try {
    // Mettre à jour la base de données avec les nouvelles colonnes
    await updateDatabase();
    
    // Synchroniser les modèles Sequelize avec la base de données
    // force: false = ne pas recréer les tables existantes
    await sequelize.sync({ force: false });
    console.log('✅ Base de données synchronisée avec succès');
    
    // Vérifier si un administrateur existe, sinon en créer un par défaut
    const adminCount = await User.count({ where: { role: 'admin' } });
    if (adminCount === 0) {
      console.log('📝 Aucun administrateur trouvé, création d\'un admin par défaut...');
      await User.create({
        name: 'Administrateur',
        email: 'admin@phishtracer.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Administrateur par défaut créé (email: admin@phishtracer.com, mot de passe: admin123)');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
};

module.exports = { initDatabase }; 