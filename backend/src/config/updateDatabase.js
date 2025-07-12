const { sequelize } = require('./database');

// Script de mise à jour de la base de données
const updateDatabase = async () => {
  try {
    console.log('🔄 Mise à jour de la base de données...');
    
    // Vérifier si la colonne emailContent existe déjà
    const [columns] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'scans' 
      AND COLUMN_NAME = 'emailContent'
    `);
    
    // Ajouter la colonne emailContent si elle n'existe pas
    if (columns.length === 0) {
      await sequelize.query(`ALTER TABLE scans ADD COLUMN emailContent TEXT NULL`);
      console.log('✅ Colonne emailContent ajoutée');
    }
    
    // Modifier les autres colonnes
    await sequelize.query(`ALTER TABLE scans MODIFY COLUMN url TEXT NULL`);
    await sequelize.query(`ALTER TABLE scans MODIFY COLUMN jobId VARCHAR(255) NULL`);
    
    // Modifier l'ENUM disposition
    try {
      await sequelize.query(`ALTER TABLE scans MODIFY COLUMN disposition ENUM('phish', 'phishing', 'safe', 'clean', 'unknown') NULL`);
    } catch (error) {
      // Si l'ENUM existe déjà, on peut ignorer cette erreur
      console.log('ℹ️ ENUM disposition déjà à jour');
    }
    
    console.log('✅ Base de données mise à jour avec succès');
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de la base de données:', error);
    throw error;
  }
};

module.exports = { updateDatabase }; 