require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const config = require('../config/config');

const createAdmin = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connecté à MongoDB');

    const adminData = {
      name: 'Admin',
      email: 'admin@phishtracer.com',
      password: 'admin123',
      role: 'admin'
    };

    const admin = await Admin.create(adminData);
    console.log('Administrateur créé avec succès:', admin);

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
    process.exit(1);
  }
};

createAdmin(); 
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const config = require('../config/config');

const createAdmin = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connecté à MongoDB');

    const adminData = {
      name: 'Admin',
      email: 'admin@phishtracer.com',
      password: 'admin123',
      role: 'admin'
    };

    const admin = await Admin.create(adminData);
    console.log('Administrateur créé avec succès:', admin);

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
    process.exit(1);
  }
};

createAdmin(); 