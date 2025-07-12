const bcrypt = require('bcryptjs');
const { Admin } = require('../models/Admin');
const { sequelize } = require('../config/database');

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie');

    // Synchroniser les modèles
    await sequelize.sync({ force: false });
    console.log('✅ Modèles synchronisés');

    // Vérifier si un admin existe déjà
    const existingAdmin = await Admin.findOne({
      where: { email: 'admin@phishtracer.com' }
    });

    if (existingAdmin) {
      console.log('⚠️  Un administrateur existe déjà avec cet email');
      return;
    }

    // Créer l'administrateur (le hash sera fait automatiquement par les hooks)
    const admin = await Admin.create({
      name: 'Administrateur PhishTracer',
      email: 'admin@phishtracer.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Administrateur créé avec succès:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Mot de passe: admin123`);
    console.log(`   ID: ${admin.id}`);

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error);
  } finally {
    await sequelize.close();
  }
};

createAdmin(); 