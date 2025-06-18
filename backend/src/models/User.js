const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

class User {
  static collection = db.collection('users');

  static async create(userData) {
    const { email, password, name, role = 'user' } = userData;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.collection.where('email', '==', email).get();
    if (!existingUser.empty) {
      throw new Error('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer le nouvel utilisateur
    const userRef = await this.collection.add({
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date()
    });

    // Récupérer l'utilisateur créé
    const userDoc = await userRef.get();
    return {
      id: userDoc.id,
      ...userDoc.data()
    };
  }

  static async findByEmail(email) {
    try {
      console.log('Recherche de l\'utilisateur avec l\'email:', email);
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', email).get();
      
      if (snapshot.empty) {
        console.log('Aucun utilisateur trouvé avec cet email');
        return null;
      }

      const userDoc = snapshot.docs[0];
      console.log('Utilisateur trouvé avec l\'ID:', userDoc.id);
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    } catch (error) {
      console.error('Erreur lors de la recherche de l\'utilisateur:', error);
      throw error;
    }
  }

  static async findById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return {
      id: doc.id,
      ...doc.data()
    };
  }

  static async matchPassword(enteredPassword, hashedPassword) {
    console.log('Vérification du mot de passe');
    console.log('Mot de passe entré:', enteredPassword);
    console.log('Hash stocké:', hashedPassword);
    const isMatch = await bcrypt.compare(enteredPassword, hashedPassword);
    console.log('Résultat de la comparaison:', isMatch);
    return isMatch;
  }

  static async getSignedJwtToken(id) {
    return jwt.sign({ id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRE
    });
  }
}

module.exports = User; 